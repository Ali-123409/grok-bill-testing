'use client';
import { useState } from 'react';

export default function Home() {
  const [refNo, setRefNo] = useState('');
  const [billHtml, setBillHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkBill = async () => {
    if (refNo.length !== 14) {
      setError('Must be exactly 14 digits');
      return;
    }
    setLoading(true);
    setError('');
    setBillHtml('');

    try {
      const res = await fetch('/api/check-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refNo }),
      });

      if (!res.ok) throw new Error();
      const html = await res.text();
      setBillHtml(html);
    } catch {
      setError('PITC site blocked the request. Try again in 30 seconds.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-green-700">GEPCO Bill Checker</h1>
        <p className="text-center text-gray-600 mt-2">Enter your 14-digit reference number</p>

        <div className="mt-8 bg-white rounded-3xl shadow-2xl p-8">
          <input
            type="text"
            maxLength="14"
            value={refNo}
            onChange={(e) => setRefNo(e.target.value)}
            placeholder="12345678901234"
            className="w-full text-2xl border-2 border-gray-300 rounded-2xl px-6 py-5 focus:border-green-600 outline-none"
          />
          <button
            onClick={checkBill}
            disabled={loading}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold text-xl py-5 rounded-2xl transition"
          >
            {loading ? 'Loading Real Bill...' : 'View Official GEPCO Bill'}
          </button>
          {error && <p className="text-red-600 text-center mt-4 font-medium">{error}</p>}
        </div>

        {billHtml && (
          <div className="mt-12 bg-white rounded-3xl shadow-2xl overflow-hidden">
            <iframe srcDoc={billHtml} className="w-full h-[850px]" title="Official Bill" />
            <p className="text-center text-sm text-gray-500 py-4 bg-gray-50">
              ✅ This is the exact official bill from PITC
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
