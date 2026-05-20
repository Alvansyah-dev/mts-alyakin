async function test() {
  try {
    const login = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: 'admin@mtsalyakin.sch.id', password: 'password123'})
    }).then(r => r.json());
    
    const token = login.data.token;
    
    const items = await fetch('http://localhost:5000/api/gallery').then(r => r.json());
    if(!items.data || items.data.length === 0) {
      console.log('No gallery items');
      return;
    }
    const item = items.data[0];
    
    console.log('Old item:', item.description);
    
    const res = await fetch(`http://localhost:5000/api/gallery/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...item,
        description: 'Test description ' + Date.now()
      })
    });
    
    const resData = await res.json();
    console.log('Update res:', resData);
  } catch (err) {
    console.error('Error:', err);
  }
}
test();
