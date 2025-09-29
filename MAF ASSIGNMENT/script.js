
function toggleNav(){ const nav=document.querySelector('.nav'); if(nav.style.display==='flex'){nav.style.display='none';}else{nav.style.display='flex';} }
function showToast(msg,ok=true){ const t=document.createElement('div'); t.innerText=msg; t.style.position='fixed'; t.style.right='16px'; t.style.bottom='16px'; t.style.background= ok ? '#064e3b' : '#6b021f'; t.style.color='white'; t.style.padding='10px 12px'; t.style.borderRadius='8px'; document.body.appendChild(t); setTimeout(()=>t.remove(),3000); }

// Booking: save to localStorage
function submitBooking(e){
  e.preventDefault();
  const form=e.target;
  if(!form.checkValidity()){ showToast('Fill required fields', false); return; }
  const booking={
    awb: 'RJ'+Date.now(),
    sender: form.sender.value.trim(),
    receiver: form.receiver.value.trim(),
    weight: parseFloat(form.weight.value),
    pickup: form.pickup.value,
    address: form.address.value.trim(),
    created: new Date().toISOString()
  };
  if(booking.weight<=0){ showToast('Enter valid weight', false); return; }
  const arr=JSON.parse(localStorage.getItem('rj_bookings')||'[]');
  arr.push(booking);
  localStorage.setItem('rj_bookings', JSON.stringify(arr));
  document.getElementById('booking-result').innerText = 'Booked ✅ AWB: '+booking.awb;
  form.reset();
  showToast('Booking saved locally (demo)');
}

// Tracking
function trackAWB(e){
  e.preventDefault();
  const awb=document.getElementById('track-awb').value.trim();
  const arr=JSON.parse(localStorage.getItem('rj_bookings')||'[]');
  const found=arr.find(x=>x.awb===awb);
  const out=document.getElementById('track-result');
  out.innerText = found ? JSON.stringify(found, null, 2) : 'Not found';
}

// Contact form (mock)
function submitContact(e){
  e.preventDefault();
  const name=e.target.name.value.trim();
  const email=e.target.email.value.trim();
  const message=e.target.message.value.trim();
  if(!name||!email||!message){ showToast('Please fill all fields', false); return; }
  document.getElementById('contact-result').innerText='Thanks '+name+' — we will contact you shortly.';
  e.target.reset();
  showToast('Contact request sent (demo)');
}

// Admin dashboard: render bookings
function renderDashboard(){
  const out=document.getElementById('dashboard-list');
  if(!out) return;
  const arr=JSON.parse(localStorage.getItem('rj_bookings')||'[]');
  if(!arr.length){ out.innerHTML='<p class="small">No bookings yet (use Booking page)</p>'; return; }
  out.innerHTML='';
  arr.slice().reverse().forEach(b=>{
    const d=document.createElement('div'); d.className='card'; d.innerHTML=`<strong>${b.awb}</strong> — <span class="small"> ${b.created}</span>
    <div class="small">From: ${b.sender} — To: ${b.receiver} — Weight: ${b.weight}kg</div>
    <div class="small">Pickup: ${b.pickup} — Address: ${b.address}</div>`;
    out.appendChild(d);
  });
}

// Run dashboard render if on dashboard page
document.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('dashboard-list')) renderDashboard();
});
