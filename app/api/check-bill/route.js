export async function POST(request) {
  const { refNo } = await request.json();

  if (!refNo || refNo.length !== 14) {
    return new Response('Invalid 14-digit number', { status: 400 });
  }

  const formUrl = 'https://bill.pitc.com.pk/gepcobill';

  try {
    // Get fresh tokens
    const getRes = await fetch(formUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const html = await getRes.text();

    const viewState = html.match(/__VIEWSTATE" value="([^"]*)"/)?.[1] || '';
    const viewStateGen = html.match(/__VIEWSTATEGENERATOR" value="([^"]*)"/)?.[1] || '';
    const eventValidation = html.match(/__EVENTVALIDATION" value="([^"]*)"/)?.[1] || '';

    // Submit real bill request
    const formData = new URLSearchParams();
    formData.append('__VIEWSTATE', viewState);
    formData.append('__VIEWSTATEGENERATOR', viewStateGen);
    formData.append('__EVENTVALIDATION', eventValidation);
    formData.append('ctl00$ContentPlaceHolder1$txtReferenceNo', refNo);
    formData.append('ctl00$ContentPlaceHolder1$btnSearch', 'Search');

    const postRes = await fetch(formUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': formUrl
      },
      body: formData.toString()
    });

    const billHtml = await postRes.text();
    return new Response(billHtml, { headers: { 'Content-Type': 'text/html' } });
  } catch {
    return new Response('Temporary error — try again', { status: 503 });
  }
}
