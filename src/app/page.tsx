import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">PromoCard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/templates" className="text-gray-700 hover:text-blue-600 transition">
                Templates
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition">
                Pricing
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-blue-600 transition">
                Sign in
              </Link>
              <Link href="/builder" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Start Creating
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Create Beautiful Shareable Cards in 60 Seconds
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Professional cards for social media, WhatsApp, and more. No design skills needed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/builder"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition text-center"
                >
                  Create Your Card
                </Link>
                <Link
                  href="/templates"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition text-center"
                >
                  View Templates
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-3xl">👤</span>
                  </div>
                  <h3 className="font-bold text-gray-900">John Doe</h3>
                  <p className="text-gray-600 text-sm">Software Engineer</p>
                </div>
                <p className="text-gray-700 text-sm text-center mb-4">
                  Building amazing products that solve real problems
                </p>
                <div className="border-t pt-4 text-center text-sm text-gray-600">
                  <p>📱 +1 234 567 8900</p>
                  <p>📧 john@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pick a Template</h3>
              <p className="text-gray-600">Choose from our collection of professionally designed templates</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customize</h3>
              <p className="text-gray-600">Add your details, photos, and branding in seconds</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Export & Share</h3>
              <p className="text-gray-600">Download or share your card instantly on any platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Perfect For</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { icon: '🏥', name: 'Clinics' },
              { icon: '🏪', name: 'Shops' },
              { icon: '💼', name: 'Freelancers' },
              { icon: '📚', name: 'Tutors' },
              { icon: '🎯', name: 'Coaches' },
            ].map((useCase) => (
              <div key={useCase.name} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition">
                <span className="text-4xl mb-3 block">{useCase.icon}</span>
                <h3 className="font-semibold text-gray-900">{useCase.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Simple Pricing</h2>
          <p className="text-center text-gray-600 mb-12">Start free, upgrade when you need more</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-600 mb-4">Perfect for trying out</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span> 5 cards per month
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span> Basic templates
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span> Standard export quality
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span> 1 saved brand kit
                </li>
              </ul>
              <Link
                href="/builder"
                className="block w-full bg-gray-100 text-gray-900 py-3 rounded-lg text-center font-semibold hover:bg-gray-200 transition"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-blue-600 rounded-2xl shadow-lg p-8 text-white transform scale-105">
              <div className="text-sm font-semibold mb-2 bg-blue-500 inline-block px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-blue-100 mb-4">For professionals</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-blue-100">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> 50 cards per month
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> All templates
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> High export quality
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> No watermark
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> 10 saved brand kits
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Priority support
                </li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full bg-white text-blue-600 py-3 rounded-lg text-center font-semibold hover:bg-blue-50 transition"
              >
                Upgrade to Pro
              </Link>
            </div>

            {/* Business Plan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Business</h3>
              <p className="text-gray-600 mb-4">For teams and agencies</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$49</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span> Unlimited cards
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span> All templates
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span> Premium export quality
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span> Team access
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span> White-label option
                </li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full bg-gray-100 text-gray-900 py-3 rounded-lg text-center font-semibold hover:bg-gray-200 transition"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'How do I create my first card?',
                a: 'Simply choose a template, fill in your details, and export. It takes less than 60 seconds!',
              },
              {
                q: 'Can I use the cards commercially?',
                a: 'Yes! All cards you create are yours to use however you like.',
              },
              {
                q: 'What formats can I export to?',
                a: 'You can export to PNG or JPG in various sizes including Instagram Story and square formats.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes! Our free plan lets you create 5 cards per month at no cost.',
              },
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Your First Card?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of professionals creating beautiful cards</p>
          <Link
            href="/builder"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
          >
            Start Creating Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">PromoCard</h3>
              <p className="text-sm">Create beautiful shareable cards in seconds.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/templates" className="hover:text-white transition">Templates</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/builder" className="hover:text-white transition">Create Card</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 PromoCard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
