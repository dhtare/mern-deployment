export const submitFeedback = async (feedback) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_SAVE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error; 
  }
};


export const submitLogin = async (credentials) => {
    try {   
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_LOGIN_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error submitting login:', error);
      throw error; 
    }
  };


  export const submitChart1 = async (token) => {
    try {   
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_CHART_1}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error submitting login:', error);
      throw error; 
    }
  };


  
  export const submitChart2 = async (token) => {
    try {   
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_CHART_2}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error submitting login:', error);
      throw error; 
    }
  };


  export const submitChart3 = async (token) => {

    try {   
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_CHART_3}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error submitting login:', error);
      throw error; 
    }
  };

  export const submitChart4 = async (token) => {

    try {   
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_CHART_4}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error submitting login:', error);
      throw error; 
    }
  };


  
  export const submitChart5 = async (token) => {

    try {   
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_CHART_5}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error submitting login:', error);
      throw error; 
    }
  };

  
  export const submitChart6 = async (token) => {

    try {   
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_CHART_6}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error submitting login:', error);
      throw error; 
    }
  };
  
  export const submitChart8 = async (token) => {

    try {   
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_CHART_8}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error submitting login:', error);
      throw error; 
    }
  };
  
  export const submitChart10 = async (token) => {

    try {   
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_CHART_10}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error submitting login:', error);
      throw error; 
    }
  };


    
  export const submitChart11 = async (token) => {

    try {   
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_CHART_11}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error submitting login:', error);
      throw error; 
    }
  };

  export const headerCount = async (token) => {

    try {   
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_HEADCOUNT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error submitting login:', error);
      throw error; 
    }
  };



  export const fetchQrCode = async (token,requestUrl,counter) => {
    const constructedUrl = `${requestUrl}?Counter=${encodeURIComponent(counter)}`;
    try {   
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_QR_CODE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          "url": constructedUrl,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error submitting login:', error);
      throw error; 
    }
  };




