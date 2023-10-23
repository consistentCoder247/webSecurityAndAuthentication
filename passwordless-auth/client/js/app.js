const email = document.querySelector('#email');
const myForm = document.querySelector('#sign-up-form');
const container = document.querySelector('.container');
const  parent = document.querySelector(".modal-parent");
  const X = document.querySelector(".x");
  const btn = document.querySelector('.submit');
  const modalP = document.querySelector('.modal__description');
  const second = document.querySelector('.two');
  const otpForm = document.querySelector('.otp-form');
  const otpBtn = document.querySelector('.otp');
  const otpInput = document.querySelector('#otp');
  const phoneInput = document.querySelector("#phone");
const phoneLink = document.querySelector('.phone__link');


const state = {
  phoneFlag : false,
}

function phoneSetup () {
  const  iti = intlTelInput(phoneInput, {
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
    initialCountry: "auto",
    nationalMode: true,
  separateDialCode: true,
    geoIpLookup: callback => {
      fetch("https://ipapi.co/json")
        .then(res => res.json())
        .then(data => callback(data.country_code))
        .catch(() => callback("us"));
    },
  });

  let mobile_no;
  phoneInput.addEventListener('change', (e) => {
    e.preventDefault();
    mobile_no = iti.getNumber();
    console.log(mobile_no)
    } );

 

}

function setState(cb) {
  cb()
  phoneSetup();
}


phoneLink.addEventListener('click', (e) => {
  console.log("phone link button clicked");
  setState( () => {
    state.phoneFlag = true;
  })
phoneInput.style.display = 'block';
email.style.display = 'none';
e.target.style.display= "none";
})




let emailInput;
email.addEventListener('change', (e) => {
  e.preventDefault();
  emailInput= email.value;
  console.log(emailInput)

})

const postData = async (url, data) => {
  console.log(`posting data to ${url}`);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });

  return response.text();
}



myForm.addEventListener('submit', e => {
  console.log('input form submitted');
  e.preventDefault();
 
  if(state.phoneFlag) {
const user = {
  phone: mobile_no,
  isPhone: true,
}

postData('http://localhost:5000/login/mobile', user).then(() => {
  modalP.innerHTML =    `
  <p>OTP sent to your number:   <b> ${mobile_no} </b> </p>
  <hr/>
   <p> Enter the otp to login. </p>
   `;
}).catch(err => console.log({client_message: err.message}));

phoneInput.focus();
phoneInput.value = "";

  }
  else {
   const user = {
      email: email.value,
      isEmail: true,
    }

    postData('http://localhost:5000/login/email', user).then(() => {
modalP.innerHTML =    `
<p>OTP sent to your email:   <b> ${emailInput} </b> </p>
<hr/>
 <p> Enter the otp to login. </p>
 `;
  // console.log(data);
}
).catch((err) => console.log({client_message: err.message}));
;


email.focus();
email.value ="";
  }
   
})




  btn.addEventListener('click', appear);
function appear() {
  console.log("btn clicked");
    parent.style.display = "block";
    container.style.filter = "blur(10px)"
}

X.addEventListener("click", disappearX);
function disappearX() {
    parent.style.display = "none";
    // container.style.filter = "blur(0px)"
    container.style.display = "none";
    second.style.display = "block";
}
parent.addEventListener("click", disappearParent);
function disappearParent(e) {
    if (e.target.className == "modal-parent") {
        parent.style.display = "none";
        // container.style.filter = "blur(0px)"
        container.style.display = "none";
        second.style.display = "block";
    }
}


otpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = {
    email: emailInput,
    otp: otpInput.value
  }

  postData('http://localhost:5000/login/otp', user).then(res => console.log(res)).catch(err => err.message);
})


