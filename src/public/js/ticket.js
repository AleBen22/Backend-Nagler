// This is your test publishable API key.
const stripe = Stripe("pk_test_51O2KQoHT7IAQenOonVFwyWXnxE0UsHLRLtzQXH7GuPWMzJdPime2MkvHs3ndDS7oPi2XadQv8WuDxRea8tg7ldLG00HSLoWFqG");

// The items the customer wants to buy
const id = document.getElementById("id").innerText
const items = [{ id: id }];

let elements;

initialize();
checkStatus();


document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);

let emailAddress = '';
// Fetches a payment intent and captures the client secret
async function initialize() {
  const clientSecret = document.getElementById("cs").innerText
  const appearance = {
    theme: 'stripe',
  };
  elements = stripe.elements({ appearance, clientSecret });

  const linkAuthenticationElement = elements.create("linkAuthentication");
  linkAuthenticationElement.mount("#link-authentication-element");

  linkAuthenticationElement.on('change', (event) => {
    emailAddress = event.value.email;
  });

  const paymentElementOptions = {
    layout: "tabs",
  };

  const paymentElement = elements.create("payment", paymentElementOptions);
  paymentElement.mount("#payment-element");
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: `http://localhost:8080/api/carts/ticket/${id}`,
      receipt_email: emailAddress,
    },
  });

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  if (error.type === "card_error" || error.type === "validation_error") {
    showMessage(error.message);
  } else {
    showMessage("An unexpected error occurred.");
  }

  setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  switch (paymentIntent.status) {
    case "succeeded":
      showMessage("Payment succeeded!");
      break;
    case "processing":
      showMessage("Your payment is processing.");
      break;
    case "requires_payment_method":
      showMessage("Your payment was not successful, please try again.");
      break;
    default:
      showMessage("Something went wrong.");
      break;
  }
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageContainer.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}























// let ticket = Array.from(document.getElementById('ticket').children);
// ticket.forEach(button => {
//     button.addEventListener('click', ({target}) => {
//     const tid = target.value
//     console.log(tid)
//     if(tid){
//         socket.emit('payticket', tid)
//     }
// })})

// socket.on('respondUsers', data => {
//     const userList = document.querySelector( '.usersList' );
//     userList.innerHTML = '';

//     data.forEach( ( docs ) => {
//         userList.innerHTML += `
//             <div class="user">
//                 <div class="bigdiv">
//                 <p>Nombre y Apellido: ${docs.full_name}</p>
//                 <p>Email: ${docs.user}</p>
//                 <p>Role: ${docs.role}</p>
//                 <p>Id: ${docs.id}</p>
//                 </div>
//                 <div class="smalldiv">
//                 <button onclick="location.href = '/role/${docs.id}'" class="logout">Cambiar Role</button>
//                 <button id="delete" class="logout" value="${docs.id}">Eliminar</button>
//                 </div>
//             </div>
//         `;
//     });
// })