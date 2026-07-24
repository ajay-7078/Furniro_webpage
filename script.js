function sendMail() {   
    let parms = {
        from_name: document.getElementById("name").value,
        email_id: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("msg").value
    };
    emailjs.send("service_ch4a6n3", "template_iy33t6o", parms).then(alert("email Sent successfully"))

}