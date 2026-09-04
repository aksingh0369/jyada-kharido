import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ExternalLink, HelpCircle } from 'lucide-react';
import { SiteSettings } from '../types';

interface ContactViewProps {
  settings: SiteSettings;
}

export const ContactView: React.FC<ContactViewProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#F52D56] bg-rose-50 px-3 py-1 rounded-full">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">
          We’d Love To Hear From You
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Have a product recommendation, sponsorship inquiry, or feedback about Jyada Kharido?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Info cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 jk-card-shadow space-y-6">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
              Contact Details
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-50 rounded-2xl text-[#EB3B5A] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase tracking-wider text-[11px]">Email</p>
                  <p className="font-bold text-gray-900 mt-0.5">{settings.contactEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase tracking-wider text-[11px]">Direct Line</p>
                  <p className="font-bold text-gray-900 mt-0.5">{settings.contactPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase tracking-wider text-[11px]">Headquarters</p>
                  <p className="font-bold text-gray-900 mt-0.5">{settings.contactAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Amazon Order Notice card */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-800">
              <HelpCircle className="w-4 h-4" />
              <span>Questions About An Amazon Order?</span>
            </div>
            <p className="text-xs text-amber-800/90 leading-relaxed">
              Jyada Kharido is an affiliate catalog. If you need help tracking a package, requesting a refund, or managing your payment method, please contact Amazon India Support directly.
            </p>
            <a
              href="https://www.amazon.in/gp/help/customer/display.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 underline underline-offset-2 pt-1"
            >
              <span>Go to Amazon Help Center</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 jk-card-shadow">
          {submitted ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Message Received!</h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                Thank you for reaching out, <strong>{name}</strong>. Our editorial team will review your note and respond to <strong>{email}</strong> within 24-48 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setSubject('');
                  setMessage('');
                }}
                className="px-6 py-2.5 rounded-full bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-4">
                Send A Message
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F52D56] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="rahul@example.com"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F52D56] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Partnership or Product Feature Suggestion"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F52D56] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Write your note or question here..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F52D56] focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-[#F52D56] hover:bg-[#D82C4A] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Send Message</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
