import React, { useState } from 'react';

const FAQ = () => {
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const faqData = [
    {
      id: '01',
      question: 'How will I know if I won?',
      answer: 'You will receive an email notification immediately after the auction ends if you are the winning bidder. Additionally, you can check your account dashboard for real-time updates on your bidding status.'
    },
    {
      id: '02',
      question: 'What if I miss the end of the auction?',
      answer: 'If you miss the end of an auction, you can set up automatic bidding beforehand or enable push notifications to stay updated. We also recommend checking the auction end times and setting personal reminders.'
    },
    {
      id: '03',
      question: 'How do I contact support?',
      answer: 'You can contact our support team through multiple channels: email us at support@auctionhub.com, use the contact form above, book a 15-minute call with our agents, or visit our office headquarters.'
    },
    {
      id: '04',
      question: 'What happens if there\'s a problem with a buyer or seller?',
      answer: 'We have a comprehensive dispute resolution system. Contact our support team immediately with details of the issue. We will mediate between parties and ensure fair resolution according to our terms and conditions.'
    },
    {
      id: '05',
      question: 'How will I know if I won?',
      answer: 'You will receive an email notification immediately after the auction ends if you are the winning bidder. Additionally, you can check your account dashboard for real-time updates on your bidding status.'
    }
  ];

  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-black mb-4 ">Frequently Asked Questions</h2>
        <p className="text-gray-600 text-base">Contact us if you still have any questions to make your experience smoother.</p>
      </div>

      <div className="space-y-0 border-t border-gray-200">
        {faqData.map((faq) => {
  const isExpanded = expandedQuestions[faq.id];
  return (
    <div key={faq.id} className="border-b border-gray-200 ">
      <button
        className="w-full py-6 px-0 flex items-center justify-between text-left hover:bg-gray-50 hover:px-4 transition-all duration-200 group"
        onClick={() => toggleQuestion(faq.id)}
      >
        <div className="flex items-center gap-6">
          <span className="text-base font-semibold text-black min-w-[2rem]">{faq.id}</span>
          <span className="text-base font-semibold text-black">{faq.question}</span>
        </div>
        <div className={`ml-4 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* Smooth transition container */}
      <div
        className={`overflow-hidden transition-all duration-800`}
        style={{ maxHeight: isExpanded ? "500px" : "0" }}
      >
        <div className="pb-6 pl-14 pr-6">
          <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
})}

      </div>
    </div>
  );
};

export default FAQ;
