export interface KnowledgeEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: string;
}

export const defaultKnowledge: Omit<KnowledgeEntry, "id">[] = [
  {
    category: "Shipping",
    question: "how long does shipping take",
    answer:
      "Standard shipping takes 3-5 business days within the US. Express shipping (1-2 business days) and overnight options are available at checkout. International shipping takes 7-14 business days depending on the destination.",
  },
  {
    category: "Shipping",
    question: "how much does shipping cost",
    answer:
      "Standard shipping is free on orders over $50. For orders under $50, standard shipping costs $5.99. Express shipping is $12.99 and overnight is $24.99.",
  },
  {
    category: "Shipping",
    question: "track my order",
    answer:
      "You can track your order by logging into your account and visiting the 'Order History' page. A tracking link is also sent to your email once your order ships. If you haven't received a tracking email within 48 hours, please reach out to us.",
  },
  {
    category: "Shipping",
    question: "do you ship internationally",
    answer:
      "Yes! We ship to over 40 countries worldwide. International shipping costs are calculated at checkout based on your location. Delivery typically takes 7-14 business days.",
  },
  {
    category: "Returns",
    question: "what is your return policy",
    answer:
      "We offer a 30-day return policy on all unused items in their original packaging. Items must be unworn and have tags attached. Refunds are processed within 5-7 business days of receiving your return.",
  },
  {
    category: "Returns",
    question: "how do i return an item",
    answer:
      "To return an item, log into your account, go to 'Order History', select the order, and click 'Return Item'. You'll receive a prepaid return shipping label via email. Drop off the package at any authorized location.",
  },
  {
    category: "Returns",
    question: "can i exchange an item",
    answer:
      "Yes, exchanges are free within 30 days. Start an exchange from your order history page, select the new size or color, and we'll send a return label for the original item.",
  },
  {
    category: "Account",
    question: "how do i reset my password",
    answer:
      "To reset your password, click 'Forgot Password' on the login page. Enter your email and we'll send a reset link. The link expires after 1 hour for security.",
  },
  {
    category: "Account",
    question: "how do i change my email",
    answer:
      "Go to 'Account Settings' > 'Profile' to update your email. You'll receive a verification email at the new address — click the link to confirm the change.",
  },
  {
    category: "Account",
    question: "delete my account",
    answer:
      "To delete your account, go to 'Account Settings' > 'Privacy' and select 'Delete Account'. This action is permanent and cannot be undone. Any pending orders will be cancelled.",
  },
  {
    category: "Payment",
    question: "what payment methods do you accept",
    answer:
      "We accept Visa, Mastercard, American Express, Discover, Apple Pay, Google Pay, and PayPal. All transactions are encrypted and secure.",
  },
  {
    category: "Payment",
    question: "why was my payment declined",
    answer:
      "Payments can be declined for several reasons: insufficient funds, incorrect billing address, or your bank's fraud detection. Try a different card or contact your bank. If issues persist, reach out to our support team.",
  },
  {
    category: "Payment",
    question: "is my payment information secure",
    answer:
      "Absolutely. We use 256-bit SSL encryption and are PCI DSS compliant. We never store your full card number — all payment processing is handled by our certified payment processor.",
  },
  {
    category: "Product",
    question: "are your products in stock",
    answer:
      "Stock availability is shown on each product page. If an item is out of stock, you can sign up for 'Back in Stock' notifications by clicking the button on the product page.",
  },
  {
    category: "Product",
    question: "do you offer a warranty",
    answer:
      "Yes, all our products come with a 1-year manufacturer warranty covering defects in materials and workmanship. Extended warranties are available for purchase at checkout.",
  },
  {
    category: "Contact",
    question: "how do i contact a human agent",
    answer:
      "You can reach our support team by emailing support@example.com or calling 1-800-555-0199, Monday-Friday 9am-6pm EST. You can also start a live chat from our help center.",
  },
  {
    category: "Contact",
    question: "what are your support hours",
    answer:
      "Our support team is available Monday through Friday, 9am to 6pm EST. You can also browse our help center articles 24/7, and we'll respond to emails within 24 hours.",
  },
];

export const categoryColors: Record<string, string> = {
  Shipping: "text-sky-300 bg-sky-500/10 border-sky-400/30",
  Returns: "text-amber-300 bg-amber-500/10 border-amber-400/30",
  Account: "text-emerald-300 bg-emerald-500/10 border-emerald-400/30",
  Payment: "text-rose-300 bg-rose-500/10 border-rose-400/30",
  Product: "text-indigo-300 bg-indigo-500/10 border-indigo-400/30",
  Contact: "text-violet-300 bg-violet-500/10 border-violet-400/30",
};
