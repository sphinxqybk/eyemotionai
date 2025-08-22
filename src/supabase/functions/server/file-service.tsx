// EyeMotion File Management Service
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { uploadProjectFile, deductCredits } from './database-setup.tsx';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Storage bucket configuration
const STORAGE_BUCKETS = {
  projects: 'eyemotion-projects',
  uploads: 'eyemotion-uploads',
  exports: 'eyemotion-exports',
  thumbnails: 'eyemotion-thumbnails'
};

// File type configurations
const SUPPORTED_VIDEO_FORMATS = [
  'mp4', 'mov', 'avi', 'mkv', 'wmv', 'flv', 'webm', 
  'mxf', 'prores', 'dnxhd', 'h264', 'h265'
];

const SUPPORTED_AUDIO_FORMATS = [
  'mp3', 'wav', 'aac', 'flac', 'ogg', 'wma', 'aiff'
];

const SUPPORTED_IMAGE_FORMATS = [
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10GB
const CREDITS_PER_GB = 10; // 10 credits per GB processed

// Initialize Storage Buckets
export const initializeStorageBuckets = async () => {
  try {
    console.log('📁 Initializing storage buckets...');

    for (const [name, bucketName] of Object.entries(STORAGE_BUCKETS)) {
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);

      if (!bucketExists) {
        // Create bucket
        const { error } = await supabase.storage.createBucket(bucketName, {
          public: false,
          allowedMimeTypes: [
            'video/*',
            'audio/*',
            'image/*',
            'application/json'
          ],
          fileSizeLimit: MAX_FILE_SIZE
        });

        if (error) throw error;
        console.log(`✅ Bucket created: ${bucketName}`);
      } else {
        console.log(`✅ Bucket exists: ${bucketName}`);
      }
    }

    console.log('✅ Storage buckets initialized');
    return { success: true };
  } catch (error) {
    console.error('❌ Initialize storage buckets failed:', error);
    return { success: false, error: error.message };
  }
};

// Generate Upload URL
export const generateUploadUrl = async (
  userId: string, 
  projectId: string, 
  fileName: string, 
  fileSize: number,
  fileType: string
) => {
  try {
    console.log('📁 Generating upload URL:', fileName);

    // Validate file type
    const extension = fileName.toLowerCase().split('.').pop();
    const isSupported = [
      ...SUPPORTED_VIDEO_FORMATS,
      ...SUPPORTED_AUDIO_FORMATS,
      ...SUPPORTED_IMAGE_FORMATS
    ].includes(extension || '');

    if (!isSupported) {
      throw new Error(`Unsupported file type: ${extension}`);
    }

    // Check file size
    if (fileSize > MAX_FILE_SIZE) {
      throw new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024 * 1024)}GB`);
    }

    // Calculate credits needed
    const creditsNeeded = Math.ceil((fileSize / (1024 * 1024 * 1024)) * CREDITS_PER_GB);
    
    // Check if user has enough credits
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('credits_included, credits_used')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (subError) throw subError;

    const remainingCredits = subscription.credits_included - subscription.credits_used;
    if (remainingCredits < creditsNeeded) {
      throw new Error(`Insufficient credits. Need ${creditsNeeded}, have ${remainingCredits}`);
    }

    // Generate unique file path
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const uniqueFileName = `${timestamp}-${crypto.randomUUID()}-${fileName}`;
    const filePath = `projects/${projectId}/uploads/${uniqueFileName}`;

    // Create signed upload URL
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from(STORAGE_BUCKETS.uploads)
      .createSignedUploadUrl(filePath);

    if (urlError) throw urlError;

    // Create pending file record
    const { data: fileRecord, error: recordError } = await supabase
      .from('project_files')
      .insert({
        project_id: projectId,
        user_id: userId,
        filename: uniqueFileName,
        original_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        storage_path: filePath,
        processing_status: 'pending_upload',
        credits_cost: creditsNeeded,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (recordError) throw recordError;

    console.log('✅ Upload URL generated:', fileRecord.id);
    
    return {
      success: true,
      uploadUrl: signedUrl.signedUrl,
      fileId: fileRecord.id,
      filePath: filePath,
      creditsNeeded: creditsNeeded
    };
  } catch (error) {
    console.error('❌ Generate upload URL failed:', error);
    return { success: false, error: error.message };
  }
};

// Confirm File Upload
export const confirmFileUpload = async (fileId: string, userId: string) => {
  try {
    console.log('📁 Confirming file upload:', fileId);

    // Get file record
    const { data: fileRecord, error: fileError } = await supabase
      .from('project_files')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', userId)
      .single();

    if (fileError) throw fileError;

    // Verify file exists in storage
    const { data: fileInfo, error: storageError } = await supabase.storage
      .from(STORAGE_BUCKETS.uploads)
      .list(fileRecord.storage_path.split('/').slice(0, -1).join('/'));

    if (storageError) throw storageError;

    const uploadedFile = fileInfo.find(f => 
      fileRecord.storage_path.endsWith(f.name)
    );

    if (!uploadedFile) {
      throw new Error('File not found in storage');
    }

    // Deduct credits
    const creditsResult = await deductCredits(
      userId, 
      fileRecord.credits_cost, 
      `file_upload:${fileRecord.filename}`
    );

    if (!creditsResult.success) {
      throw new Error(creditsResult.error);
    }

    // Update file status
    const { error: updateError } = await supabase
      .from('project_files')
      .update({
        processing_status: 'uploaded',
        file_size: uploadedFile.metadata?.size || fileRecord.file_size,
        updated_at: new Date().toISOString()
      })
      .eq('id', fileId);

    if (updateError) throw updateError;

    // Start processing pipeline
    await startFileProcessing(fileId);

    console.log('✅ File upload confirmed:', fileId);
    return { 
      success: true, 
      fileId: fileId,
      remainingCredits: creditsResult.remainingCredits
    };
  } catch (error) {
    console.error('❌ Confirm file upload failed:', error);
    return { success: false, error: error.message };
  }
};

// Start File Processing
const startFileProcessing = async (fileId: string) => {
  try {
    console.log('🔄 Starting file processing:', fileId);

    // Get file record
    const { data: fileRecord, error: fileError } = await supabase
      .from('project_files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (fileError) throw fileError;

    // Update status to processing
    await supabase
      .from('project_files')
      .update({
        processing_status: 'processing',
        processing_started_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', fileId);

    // Generate thumbnail for video files
    if (SUPPORTED_VIDEO_FORMATS.includes(fileRecord.file_type)) {
      await generateVideoThumbnail(fileId);
    }

    // Extract metadata
    await extractFileMetadata(fileId);

    // Update status to ready
    await supabase
      .from('project_files')
      .update({
        processing_status: 'ready',
        processing_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', fileId);

    console.log('✅ File processing completed:', fileId);
    return { success: true };
  } catch (error) {
    console.error('❌ File processing failed:', error);
    
    // Update status to error
    await supabase
      .from('project_files')
      .update({
        processing_status: 'error',
        processing_error: error.message,
        updated_at: new Date().toISOString()
      })
      .eq('id', fileId);

    return { success: false, error: error.message };
  }
};

// Generate Video Thumbnail
const generateVideoThumbnail = async (fileId: string) => {
  try {
    console.log('🖼️ Generating video thumbnail:', fileId);

    // Get file record
    const { data: fileRecord, error: fileError } = await supabase
      .from('project_files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (fileError) throw fileError;

    // Get signed URL for video file
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from(STORAGE_BUCKETS.uploads)
      .createSignedUrl(fileRecord.storage_path, 3600);

    if (urlError) throw urlError;

    // TODO: Implement video thumbnail generation using FFmpeg or similar
    // For now, we'll create a placeholder
    const thumbnailPath = `thumbnails/${fileId}/thumbnail.jpg`;
    
    // Generate placeholder thumbnail
    const placeholderThumbnail = await generatePlaceholderThumbnail(fileRecord.original_name);
    
    // Upload thumbnail
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.thumbnails)
      .upload(thumbnailPath, placeholderThumbnail);

    if (uploadError) throw uploadError;

    // Update file record with thumbnail URL
    const { data: thumbnailUrl, error: thumbnailError } = await supabase.storage
      .from(STORAGE_BUCKETS.thumbnails)
      .createSignedUrl(thumbnailPath, 31536000); // 1 year

    if (thumbnailError) throw thumbnailError;

    await supabase
      .from('project_files')
      .update({
        thumbnail_url: thumbnailUrl.signedUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', fileId);

    console.log('✅ Video thumbnail generated:', fileId);
    return { success: true };
  } catch (error) {
    console.error('❌ Generate video thumbnail failed:', error);
    return { success: false, error: error.message };
  }
};

// Generate Placeholder Thumbnail
const generatePlaceholderThumbnail = async (filename: string) => {
  // Create a simple SVG placeholder
  const svg = `
    <svg width="320" height="180" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="180" fill="#000"/>
      <circle cx="160" cy="90" r="30" fill="#fff" opacity="0.8"/>
      <polygon points="150,75 180,90 150,105" fill="#000"/>
      <text x="160" y="140" text-anchor="middle" fill="#fff" font-family="Arial" font-size="12">
        ${filename.slice(0, 30)}${filename.length > 30 ? '...' : ''}
      </text>
    </svg>
  `;
  
  return new Blob([svg], { type: 'image/svg+xml' });
};

// Extract File Metadata
const extractFileMetadata = async (fileId: string) => {
  try {
    console.log('📊 Extracting file metadata:', fileId);

    // Get file record
    const { data: fileRecord, error: fileError } = await supabase
      .from('project_files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (fileError) throw fileError;

    // Mock metadata extraction
    const metadata = {
      duration: SUPPORTED_VIDEO_FORMATS.includes(fileRecord.file_type) ? 
        Math.floor(Math.random() * 3600) : null, // Random duration for demo
      resolution: SUPPORTED_VIDEO_FORMATS.includes(fileRecord.file_type) ? 
        { width: 1920, height: 1080 } : null,
      fps: SUPPORTED_VIDEO_FORMATS.includes(fileRecord.file_type) ? 29.97 : null,
      codec: fileRecord.file_type,
      bitrate: Math.floor(Math.random() * 50000000), // Random bitrate
      format: fileRecord.file_type,
      created_at: new Date().toISOString()
    };

    // Update file record with metadata
    await supabase
      .from('project_files')
      .update({
        duration: metadata.duration,
        metadata: metadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', fileId);

    console.log('✅ File metadata extracted:', fileId);
    return { success: true, metadata };
  } catch (error) {
    console.error('❌ Extract file metadata failed:', error);
    return { success: false, error: error.message };
  }
};

// Get Project Files
export const getProjectFiles = async (projectId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('project_files')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('❌ Get project files failed:', error);
    return { success: false, error: error.message };
  }
};

// Delete File
export const deleteFile = async (fileId: string, userId: string) => {
  try {
    console.log('🗑️ Deleting file:', fileId);

    // Get file record
    const { data: fileRecord, error: fileError } = await supabase
      .from('project_files')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', userId)
      .single();

    if (fileError) throw fileError;

    // Delete from storage
    if (fileRecord.storage_path) {
      await supabase.storage
        .from(STORAGE_BUCKETS.uploads)
        .remove([fileRecord.storage_path]);
    }

    // Delete thumbnail
    if (fileRecord.thumbnail_url) {
      const thumbnailPath = `thumbnails/${fileId}/thumbnail.jpg`;
      await supabase.storage
        .from(STORAGE_BUCKETS.thumbnails)
        .remove([thumbnailPath]);
    }

    // Delete database record
    const { error: deleteError } = await supabase
      .from('project_files')
      .delete()
      .eq('id', fileId);

    if (deleteError) throw deleteError;

    console.log('✅ File deleted:', fileId);
    return { success: true };
  } catch (error) {
    console.error('❌ Delete file failed:', error);
    return { success: false, error: error.message };
  }
};

// Get File Download URL
export const getFileDownloadUrl = async (fileId: string, userId: string) => {
  try {
    console.log('📥 Getting file download URL:', fileId);

    // Get file record
    const { data: fileRecord, error: fileError } = await supabase
      .from('project_files')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', userId)
      .single();

    if (fileError) throw fileError;

    // Create signed download URL
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from(STORAGE_BUCKETS.uploads)
      .createSignedUrl(fileRecord.storage_path, 3600); // 1 hour expiry

    if (urlError) throw urlError;

    console.log('✅ File download URL generated:', fileId);
    return { 
      success: true, 
      downloadUrl: signedUrl.signedUrl,
      filename: fileRecord.original_name
    };
  } catch (error) {
    console.error('❌ Get file download URL failed:', error);
    return { success: false, error: error.message };
  }
};

// Get Storage Usage
export const getStorageUsage = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('project_files')
      .select('file_size')
      .eq('user_id', userId);

    if (error) throw error;

    const totalSize = data.reduce((sum, file) => sum + (file.file_size || 0), 0);
    const totalSizeGB = totalSize / (1024 * 1024 * 1024);

    return { 
      success: true, 
      totalBytes: totalSize,
      totalGB: totalSizeGB,
      fileCount: data.length
    };
  } catch (error) {
    console.error('❌ Get storage usage failed:', error);
    return { success: false, error: error.message };
  }
};