import { FaHome, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        
        {/* Contact Us */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase">
            Contact Us
          </h2>
          <div className="flex items-start gap-3 mb-3">
            <FaHome className="text-green-600 text-xl mt-1" />
            <p className="text-sm leading-relaxed">
              <strong>Head Office:</strong> 161 Radford Road, Hyson Green,
              Nottingham NG7 5EH <br />
              <strong>Bradford Branch:</strong> 830 Leeds Road BD3 9TX
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            © {new Date().getFullYear()} - Nottingham Travel. Many of the flights and flight-inclusive
            holidays on this website are financially protected by the ATOL scheme.
          </p>
        </div>

        {/* Get in Touch */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase">
            Get In Touch
          </h2>
          <div className="flex items-center gap-3 mb-3">
            <FaPhoneAlt className="text-green-600 text-lg" />
            <p className="text-sm">01159 78 78 99</p>
          </div>
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-green-600 text-lg" />
            <p className="text-sm">sales@nottinghamtravel.com</p>
          </div>
        </div>

        {/* Logos */}
        <div className="flex flex-col md:items-end items-start">
          <div className="flex gap-6 mb-3">
            <img
              src="https://nottinghamtravel.co.uk/App_Themes/Theme1/nt15032021/nt150321/images/Footer/atol.png"
              alt="ATOL Protected"
              className="w-16 h-16 object-contain bg-black"
            />
            <img
              src="https://nottinghamtravel.co.uk/App_Themes/Theme1/nt15032021/nt150321/images/Footer/IATA.png"
              alt="IATA"
              className="w-16 h-16 object-contain bg-black"
            />
          </div>
          <p className="text-xs text-gray-500 leading-relaxed text-right">
            Company Registration Number: <strong>06450479</strong> <br />
            Registered Company Address: 161 Radford Road, Nottingham,
            Nottinghamshire, NG7 5EH.
          </p>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="mt-8 border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()}. Nottingham Travel. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
