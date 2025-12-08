// app/components/ContactSection.tsx

import Link from "next/link";
import { ContactInfo } from "./ContactInfo";
import { PhoneIcon, MailIcon } from "@/components/Icons";

export function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question or ready to book our services? Contact us today.
          </p>
        </div>
        <div className="flex flex-col items-start space-y-8 md:flex-row md:justify-center md:space-x-16 md:space-y-0">
          {/* Contact Form */}
          {/* <form className="space-y-6">
            <Input type="text" placeholder="Name" required />
            <Input type="email" placeholder="Email" required />
            <Textarea placeholder="Message" rows={4} required />
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Send Message
            </Button>
          </form> */}
          <Link
            href="tel:+18778192351"
            className="flex items-center space-x-4 text-gray-800 hover:text-primary transition"
          >
            <PhoneIcon className="h-6 w-6 text-primary" />
            <span className="font-medium">Phone: +1 (877) 819-2351</span>
          </Link>
          <Link
            href="mailto:customsupreme@gmail.com"
            className="flex items-center space-x-4 text-gray-800 hover:text-primary transition"
          >
            <MailIcon className="h-6 w-6 text-primary" />
            <span className="font-medium">Email: admin@custosupreme.com</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
