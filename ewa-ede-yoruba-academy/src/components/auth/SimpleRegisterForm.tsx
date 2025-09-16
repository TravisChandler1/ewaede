'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle } from 'lucide-react';

export default function SimpleRegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    countryCode: '+234', // Default to Nigeria
    role: 'STUDENT',
    level: 'NOVICE'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Debug log for signup form learning levels
  console.log('Signup form learning levels:', [
    'NOVICE: Novice - $220 full course / $15 per class',
    'BEGINNER: Beginner - $390 full course / $15 per class',
    'INTERMEDIATE: Intermediate - $300 full course / $15 per class',
    'ADVANCED: Advanced - $300 full course / $15 per class',
    'INDIVIDUAL: Individual - $480 full course / $20 per class'
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setErrors({ form: 'First name, last name, email, and password are required' });
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ form: 'Please enter a valid email address' });
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setErrors({ form: 'Password must be at least 8 characters long' });
      setLoading(false);
      return;
    }

    // Check for password requirements: capital letter, number, and symbol
    const hasCapitalLetter = /[A-Z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password);

    if (!hasCapitalLetter || !hasNumber || !hasSymbol) {
      setErrors({ form: 'Password must contain at least one capital letter, one number, and one symbol' });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ form: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phoneNumber: `${formData.countryCode}${formData.phoneNumber}`,
          country: 'Nigeria', // Default for now
          role: formData.role,
          level: formData.level
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      console.log('Registration successful, user created with role:', formData.role);

      // Auto-redirect after 2 seconds
      setTimeout(() => {
        const role = formData.role.toLowerCase();
        console.log('Redirecting after registration to role-based dashboard:', role);
        if (role === 'admin') {
          console.log('Redirecting to admin dashboard');
          window.location.href = '/admin/dashboard';
        } else if (role === 'teacher') {
          console.log('Redirecting to teacher dashboard');
          window.location.href = '/dashboard/teacher';
        } else {
          console.log('Redirecting to student dashboard');
          window.location.href = '/dashboard/student';
        }
      }, 2000);
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 shadow-2xl max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-[#e69d2a] mr-2" />
            <h1 className="font-bold text-2xl text-white">Success!</h1>
          </div>
          <p className="text-[#a1a1aa] mb-6">Your account has been created successfully.</p>
          <Link
            href="/auth/signin"
            className="inline-block px-6 py-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg font-medium transition-colors"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen size={32} className="text-[#4f46e5] mr-2" />
            <h1 className="font-bold text-2xl text-white">Create Account</h1>
          </div>
          <p className="text-[#a1a1aa]">Join Ẹwà Èdè Yorùbá Academy</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#d1d5db] mb-2">
                First Name <span className="text-[#f59e0b]">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:border-[#4f46e5] focus:outline-none transition-colors"
                placeholder="Enter your first name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#d1d5db] mb-2">
                Last Name <span className="text-[#f59e0b]">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:border-[#4f46e5] focus:outline-none transition-colors"
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#d1d5db] mb-2">
              Email <span className="text-[#f59e0b]">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:border-[#4f46e5] focus:outline-none transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#d1d5db] mb-2">Phone Number</label>
            <div className="flex">
              <select
                value={formData.countryCode}
                onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                className="px-3 py-3 bg-[#0f0f0f] border border-[#374151] rounded-l-lg text-white focus:border-[#4f46e5] focus:outline-none transition-colors"
              >
                <option value="+234">🇳🇬 +234</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+91">🇮🇳 +91</option>
                <option value="+27">🇿🇦 +27</option>
                <option value="+233">🇬🇭 +233</option>
                <option value="+225">🇨🇮 +225</option>
                <option value="+228">🇹🇬 +228</option>
                <option value="+229">🇧🇯 +229</option>
                <option value="+220">🇬🇲 +220</option>
                <option value="+221">🇸🇳 +221</option>
                <option value="+224">🇬🇳 +224</option>
                <option value="+231">🇱🇷 +231</option>
                <option value="+232">🇸🇱 +232</option>
                <option value="+240">🇦🇴 +240</option>
                <option value="+241">🇬🇦 +241</option>
                <option value="+242">🇨🇬 +242</option>
                <option value="+243">🇨🇩 +243</option>
                <option value="+244">🇦🇴 +244</option>
                <option value="+245">🇬🇼 +245</option>
                <option value="+246">🇮🇴 +246</option>
                <option value="+248">🇸🇨 +248</option>
                <option value="+249">🇸🇩 +249</option>
                <option value="+250">🇷🇼 +250</option>
                <option value="+251">🇪🇹 +251</option>
                <option value="+252">🇸🇴 +252</option>
                <option value="+253">🇩🇯 +253</option>
                <option value="+254">🇰🇪 +254</option>
                <option value="+255">🇹🇿 +255</option>
                <option value="+256">🇺🇬 +256</option>
                <option value="+257">🇧🇮 +257</option>
                <option value="+258">🇲🇿 +258</option>
                <option value="+260">🇿🇲 +260</option>
                <option value="+261">🇲🇬 +261</option>
                <option value="+262">🇷🇪 +262</option>
                <option value="+263">🇿🇼 +263</option>
                <option value="+264">🇳🇦 +264</option>
                <option value="+265">🇲🇼 +265</option>
                <option value="+266">🇱🇸 +266</option>
                <option value="+267">🇧🇼 +267</option>
                <option value="+268">🇸🇿 +268</option>
                <option value="+269">🇰🇲 +269</option>
                <option value="+290">🇸🇭 +290</option>
                <option value="+291">🇪🇷 +291</option>
                <option value="+297">🇦🇼 +297</option>
                <option value="+298">🇫🇴 +298</option>
                <option value="+299">🇬🇱 +299</option>
                <option value="+350">🇬🇮 +350</option>
                <option value="+351">🇵🇹 +351</option>
                <option value="+352">🇱🇺 +352</option>
                <option value="+353">🇮🇪 +353</option>
                <option value="+354">🇮🇸 +354</option>
                <option value="+355">🇦🇱 +355</option>
                <option value="+356">🇲🇹 +356</option>
                <option value="+357">🇨🇾 +357</option>
                <option value="+358">🇫🇮 +358</option>
                <option value="+359">🇧🇬 +359</option>
                <option value="+370">🇱🇹 +370</option>
                <option value="+371">🇱🇻 +371</option>
                <option value="+372">🇪🇪 +372</option>
                <option value="+373">🇲🇩 +373</option>
                <option value="+374">🇦🇲 +374</option>
                <option value="+375">🇧🇾 +375</option>
                <option value="+376">🇦🇩 +376</option>
                <option value="+377">🇲🇨 +377</option>
                <option value="+378">🇸🇲 +378</option>
                <option value="+380">🇺🇦 +380</option>
                <option value="+381">🇷🇸 +381</option>
                <option value="+382">🇲🇪 +382</option>
                <option value="+383">🇽🇰 +383</option>
                <option value="+385">🇭🇷 +385</option>
                <option value="+386">🇸🇮 +386</option>
                <option value="+387">🇧🇦 +387</option>
                <option value="+389">🇲🇰 +389</option>
                <option value="+420">🇨🇿 +420</option>
                <option value="+421">🇸🇰 +421</option>
                <option value="+423">🇱🇮 +423</option>
                <option value="+500">🇫🇰 +500</option>
                <option value="+501">🇧🇿 +501</option>
                <option value="+502">🇬🇹 +502</option>
                <option value="+503">🇸🇻 +503</option>
                <option value="+504">🇭🇳 +504</option>
                <option value="+505">🇳🇮 +505</option>
                <option value="+506">🇨🇷 +506</option>
                <option value="+507">🇵🇦 +507</option>
                <option value="+508">🇵🇲 +508</option>
                <option value="+509">🇭🇹 +509</option>
                <option value="+590">🇬🇵 +590</option>
                <option value="+591">🇧🇴 +591</option>
                <option value="+592">🇬🇾 +592</option>
                <option value="+593">🇪🇨 +593</option>
                <option value="+594">🇬🇫 +594</option>
                <option value="+595">🇵🇾 +595</option>
                <option value="+596">🇲🇶 +596</option>
                <option value="+597">🇸🇷 +597</option>
                <option value="+598">🇺🇾 +598</option>
                <option value="+599">🇨🇼 +599</option>
                <option value="+670">🇹🇱 +670</option>
                <option value="+672">🇦🇶 +672</option>
                <option value="+673">🇧🇳 +673</option>
                <option value="+674">🇳🇷 +674</option>
                <option value="+675">🇵🇬 +675</option>
                <option value="+676">🇹🇴 +676</option>
                <option value="+677">🇸🇧 +677</option>
                <option value="+678">🇻🇺 +678</option>
                <option value="+679">🇫🇯 +679</option>
                <option value="+680">🇵🇼 +680</option>
                <option value="+681">🇼🇫 +681</option>
                <option value="+682">🇨🇰 +682</option>
                <option value="+683">🇳🇺 +683</option>
                <option value="+684">🇦🇸 +684</option>
                <option value="+685">🇼🇸 +685</option>
                <option value="+686">🇰🇮 +686</option>
                <option value="+687">🇳🇨 +687</option>
                <option value="+688">🇹🇻 +688</option>
                <option value="+689">🇵🇫 +689</option>
                <option value="+690">🇹🇰 +690</option>
                <option value="+691">🇫🇲 +691</option>
                <option value="+692">🇲🇭 +692</option>
                <option value="+850">🇰🇵 +850</option>
                <option value="+852">🇭🇰 +852</option>
                <option value="+853">🇲🇴 +853</option>
                <option value="+855">🇰🇭 +855</option>
                <option value="+856">🇱🇦 +856</option>
                <option value="+880">🇧🇩 +880</option>
                <option value="+886">🇹🇼 +886</option>
                <option value="+960">🇲🇻 +960</option>
                <option value="+961">🇱🇧 +961</option>
                <option value="+962">🇯🇴 +962</option>
                <option value="+963">🇸🇾 +963</option>
                <option value="+964">🇮🇶 +964</option>
                <option value="+965">🇰🇼 +965</option>
                <option value="+966">🇸🇦 +966</option>
                <option value="+967">🇾🇪 +967</option>
                <option value="+968">🇴🇲 +968</option>
                <option value="+970">🇵🇸 +970</option>
                <option value="+971">🇦🇪 +971</option>
                <option value="+972">🇮🇱 +972</option>
                <option value="+973">🇧🇭 +973</option>
                <option value="+974">🇶🇦 +974</option>
                <option value="+975">🇧🇹 +975</option>
                <option value="+976">🇲🇳 +976</option>
                <option value="+977">🇳🇵 +977</option>
                <option value="+992">🇹🇯 +992</option>
                <option value="+993">🇹🇲 +993</option>
                <option value="+994">🇦🇿 +994</option>
                <option value="+995">🇬🇪 +995</option>
                <option value="+996">🇰🇬 +996</option>
                <option value="+998">🇺🇿 +998</option>
              </select>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="flex-1 px-4 py-3 bg-[#0f0f0f] border border-l-0 border-[#374151] rounded-r-lg text-white placeholder-[#6b7280] focus:border-[#4f46e5] focus:outline-none transition-colors"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#d1d5db] mb-2">
              Password <span className="text-[#f59e0b]">*</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:border-[#4f46e5] focus:outline-none transition-colors"
              placeholder="Enter your password"
              required
            />
            <p className="text-xs text-[#a1a1aa] mt-1">
              Password must be at least 8 characters containing one capital letter, a number and a symbol
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#d1d5db] mb-2">
              Confirm Password <span className="text-[#f59e0b]">*</span>
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:border-[#4f46e5] focus:outline-none transition-colors"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#d1d5db] mb-2">I am a</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white focus:border-[#4f46e5] focus:outline-none transition-colors"
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
            </select>
          </div>

          {formData.role === 'STUDENT' && (
            <div>
              <label className="block text-sm font-medium text-[#d1d5db] mb-2">Learning Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white focus:border-[#4f46e5] focus:outline-none transition-colors"
              >
                <option value="NOVICE">Novice - $220 full course / $15 per class</option>
                <option value="BEGINNER">Beginner - $390 full course / $15 per class</option>
                <option value="INTERMEDIATE">Intermediate - $300 full course / $15 per class</option>
                <option value="ADVANCED">Advanced - $300 full course / $15 per class</option>
                <option value="INDIVIDUAL">Individual - $480 full course / $20 per class</option>
              </select>
            </div>
          )}

          {errors.form && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg p-3 text-[#ef4444] text-sm">
              {errors.form}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#6b7280] text-sm">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-[#4f46e5] hover:text-[#4338ca] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}