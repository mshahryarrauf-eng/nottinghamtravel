import {
  FaShieldAlt,
  FaHeadset,
  FaClock,
  FaMoneyCheckAlt,
} from "react-icons/fa";

const WhyUS = () => {
  const features = [
    {
      title: "ATOL Protected",
      description:
        "We are covered by ATOL, which means that you are financially protected. Giving you peace of mind that your holiday is safe and secure. Our Atol number is 9931.",
      icon: <FaShieldAlt className="text-blue-500 w-10 h-10 mb-4" />,
    },
    {
      title: "Customer Service Support",
      description:
        "Can't find what you're looking for? We have a dedicated team to help and support you. Call our line on 01159787899.",
      icon: <FaHeadset className="text-green-500 w-10 h-10 mb-4" />,
    },
    {
      title: "Early Bird Price Promise",
      description:
        "Early bookers will never pay more than last-minute bookers. Once you have secured your place on one of our great holiday or flight only deals by paying a deposit, we guarantee your price.",
      icon: <FaClock className="text-yellow-500 w-10 h-10 mb-4" />,
    },
    {
      title: "Spread The Cost",
      description:
        "We want to make your booking as stress-free as possible, so we have partnered with Fly Now Pay Later so you can book with flexible payment plan options.",
      icon: <FaMoneyCheckAlt className="text-red-500 w-10 h-10 mb-4" />,
    },
  ];

  return (
    <section className="py-8 ">
      <div className="text-center mb-8 px-4">
        <h1 className="text-4xl font-bold mb-2">Why Book With Us ?</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Discover the benefits of booking your holiday with us. Reliable, safe,
          and flexible options.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-4 md:px-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="flex justify-center items-center">
              {feature.icon}
            </div>
            <h2 className="text-xl poppins-medium mb-3">{feature.title}</h2>
            <p className="text-gray-600 poppins">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyUS;
