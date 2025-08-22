import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

interface ContactProps {
  language: 'th' | 'en';
}

export function Contact({ language }: ContactProps) {
  return (
    <div className="py-20 px-6 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0" 
        style={{ backgroundColor: 'oklch(0.145 0 0)' }}
      >
        <div className="absolute inset-0">
          <motion.div
            className="absolute w-72 h-72 rounded-full blur-3xl opacity-10"
            style={{ 
              backgroundColor: 'oklch(0.627 0.265 303.9)',
              top: '20%',
              right: '30%'
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 
            className="text-4xl md:text-6xl font-black tracking-tight mb-6"
            style={{ color: 'oklch(0.985 0 0)' }}
          >
            {language === 'th' ? 'ติดต่อเรา' : 'Contact Us'}
          </h1>
          
          <p 
            className="text-xl font-medium max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'oklch(0.708 0 0)' }}
          >
            {language === 'th' 
              ? 'พร้อมให้คำปรึกษาและสนับสนุนคุณในการสร้างภาพยนตร์ระดับมืออาชีพ'
              : 'Ready to support you in creating professional-grade films'
            }
          </p>
        </motion.div>

        {/* Contact Info */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {[
            {
              icon: Mail,
              title: language === 'th' ? 'อีเมล' : 'Email',
              content: 'hello@eyemotion.ai',
              color: 'oklch(0.488 0.243 264.376)'
            },
            {
              icon: Phone,
              title: language === 'th' ? 'โทรศัพท์' : 'Phone',
              content: '+66 2 123 4567',
              color: 'oklch(0.696 0.17 162.48)'
            },
            {
              icon: MapPin,
              title: language === 'th' ? 'ที่อยู่' : 'Address',
              content: language === 'th' ? 'กรุงเทพฯ, ประเทศไทย' : 'Bangkok, Thailand',
              color: 'oklch(0.769 0.188 70.08)'
            }
          ].map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                className="text-center p-8 rounded-xl border"
                style={{
                  backgroundColor: 'oklch(0.205 0 0 / 0.6)',
                  borderColor: 'oklch(0.269 0 0)'
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <IconComponent 
                    className="w-8 h-8" 
                    style={{ color: item.color }} 
                  />
                </div>
                <h3 
                  className="text-lg font-bold mb-2"
                  style={{ color: 'oklch(0.985 0 0)' }}
                >
                  {item.title}
                </h3>
                <p 
                  className="text-base font-medium"
                  style={{ color: 'oklch(0.708 0 0)' }}
                >
                  {item.content}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="p-8 rounded-xl border"
          style={{
            backgroundColor: 'oklch(0.205 0 0 / 0.6)',
            borderColor: 'oklch(0.269 0 0)'
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 
            className="text-2xl font-black mb-8 text-center"
            style={{ color: 'oklch(0.985 0 0)' }}
          >
            {language === 'th' ? 'ส่งข้อความถึงเรา' : 'Send us a message'}
          </h2>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label 
                  className="block text-sm font-bold mb-2"
                  style={{ color: 'oklch(0.985 0 0)' }}
                >
                  {language === 'th' ? 'ชื่อ' : 'Name'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border font-medium"
                  style={{
                    backgroundColor: 'oklch(0.269 0 0)',
                    borderColor: 'oklch(0.439 0 0)',
                    color: 'oklch(0.985 0 0)'
                  }}
                  placeholder={language === 'th' ? 'กรุณากรอกชื่อ' : 'Enter your name'}
                />
              </div>
              <div>
                <label 
                  className="block text-sm font-bold mb-2"
                  style={{ color: 'oklch(0.985 0 0)' }}
                >
                  {language === 'th' ? 'อีเมล' : 'Email'}
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border font-medium"
                  style={{
                    backgroundColor: 'oklch(0.269 0 0)',
                    borderColor: 'oklch(0.439 0 0)',
                    color: 'oklch(0.985 0 0)'
                  }}
                  placeholder={language === 'th' ? 'กรุณากรอกอีเมล' : 'Enter your email'}
                />
              </div>
            </div>

            <div>
              <label 
                className="block text-sm font-bold mb-2"
                style={{ color: 'oklch(0.985 0 0)' }}
              >
                {language === 'th' ? 'ข้อความ' : 'Message'}
              </label>
              <textarea
                rows={6}
                className="w-full px-4 py-3 rounded-lg border font-medium resize-none"
                style={{
                  backgroundColor: 'oklch(0.269 0 0)',
                  borderColor: 'oklch(0.439 0 0)',
                  color: 'oklch(0.985 0 0)'
                }}
                placeholder={language === 'th' ? 'กรุณากรอกข้อความ' : 'Enter your message'}
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold tracking-wide transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: 'oklch(0.488 0.243 264.376)',
                  color: 'white'
                }}
              >
                <Send className="w-5 h-5" />
                <span>{language === 'th' ? 'ส่งข้อความ' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

// Default export for AppRouter compatibility  
export default Contact;