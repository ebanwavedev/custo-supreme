'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from 'lucide-react';
import { InlineWidget } from "react-calendly";
import { toast } from 'react-hot-toast';
import { Input } from "@/components/ui/input";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  type NavItem = {
    label: string;
    href: string;
    subItems?: { label: string; href: string }[];
  };
  
  const navItems: NavItem[] = [
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
    { label: "Careers", href: "#careers" },
  ];

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
    
    setTimeout(() => {
      const section = document.querySelector(sectionId);
      if (section) {
        const headerHeight = 80; // Adjust this value based on your header height
        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: sectionTop,
          behavior: 'smooth'
        });
      }
    }, 300); // 300ms delay to allow the menu closing animation to complete
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/createAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (response.ok) {
        setShowLeadForm(false);
        setShowCalendly(true);
        toast.success('Information submitted successfully!');
      } else {
        throw new Error('Failed to submit lead information');
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error('Failed to submit information. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLeadData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <motion.header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-black/30 backdrop-blur-sm'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="CustoSupreme" width={40} height={40} />
              <span className={`font-bold text-2xl ${isScrolled ? 'text-primary' : 'text-white'}`}>CustoSupreme</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  <button
                    onClick={() => item.subItems ? toggleDropdown(item.label) : scrollToSection(item.href)}
                    className={`text-sm font-medium hover:text-primary transition-colors ${
                      isScrolled ? 'text-gray-700' : 'text-white'
                    } focus:outline-none`}
                  >
                    {item.label}
                    {item.subItems && (
                      <ChevronDown className="inline-block ml-1 w-4 h-4" />
                    )}
                  </button>
                  {item.subItems && (
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div 
                          className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.subItems.map((subItem) => (
                            <button
                              key={subItem.label}
                              onClick={() => scrollToSection(subItem.href)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {subItem.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>
            <Button 
              className="hidden md:block bg-primary text-white hover:bg-primary/90"
              onClick={() => setShowLeadForm(true)}
            >
              Schedule Quote
            </Button>
            <button
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-white shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="px-4 pt-2 pb-4 space-y-2">
                {navItems.map((item) => (
                  <div key={item.label}>
                    <button
                      onClick={() => item.subItems ? toggleDropdown(item.label) : scrollToSection(item.href)}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
                    >
                      {item.label}
                      {item.subItems && (
                        <ChevronDown className="float-right mt-1" size={16} />
                      )}
                    </button>
                    <AnimatePresence>
                      {item.subItems && activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.subItems.map((subItem) => (
                            <button
                              key={subItem.label}
                              onClick={() => scrollToSection(subItem.href)}
                              className="block w-full text-left px-6 py-2 text-sm text-gray-600 hover:bg-gray-100"
                            >
                              {subItem.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                <Button 
                  className="w-full mt-4 bg-primary text-white hover:bg-primary/90"
                  onClick={() => {
                    setShowLeadForm(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Book Now
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Lead Capture Form Modal */}
      <AnimatePresence>
        {showLeadForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg w-full max-w-[400px] m-4 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setShowLeadForm(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4">Schedule a Quote</h2>
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={leadData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={leadData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={leadData.phone}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={leadData.company}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={leadData.street}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={leadData.city}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={leadData.state}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={leadData.zipCode}
                  onChange={handleInputChange}
                  required
                />
                <Button type="submit" className="w-full">Submit</Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendly Inline Widget Modal */}
      <AnimatePresence>
        {showCalendly && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-4 rounded-lg w-full max-w-[800px] h-[600px] m-4 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setShowCalendly(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
              >
                <X size={24} />
              </button>
              <InlineWidget
                url="https://calendly.com/h-nelson-custosupreme/30min"
                styles={{ height: '100%' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
