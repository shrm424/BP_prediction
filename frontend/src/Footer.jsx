import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-primary text-black py-10 text-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Logo + About */}
                <div>
                    <h2 className=" font-semibold text-white mb-4">BPP system</h2>
                    <p className="">
                        Building modern and smart solutions for your digital needs.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h3 className=" font-semibold text-white mb-3">Quick Links</h3>
                    <ul className="space-y-2 ">
                        <li><a href="/" className="hover:text-white transition">Home</a></li>
                        <li><a href="/predict" className="hover:text-white transition">Prediction</a></li>
                        <li><a href="/history" className="hover:text-white transition">History</a></li>
                        <li><a href="/profile" className="hover:text-white transition">Profile</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className=" font-semibold text-white mb-3">Contact</h3>
                    <ul className=" space-y-2">
                        <li>Email: bppredict@gmail.com</li>
                        <li>Phone: +252-61-760-0424</li>
                    </ul>
                </div>

            </div>

            {/* Bottom Note */}
            <div className="mt-8 border-t border-neutral-700 pt-4 text-center  text-neutral-500">
                &copy; {new Date().getFullYear()} BP prediction. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
