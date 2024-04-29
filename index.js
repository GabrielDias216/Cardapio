const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')


let cart = []

cartBtn.addEventListener('click', () => {
  cartModal.style.display = 'flex'
})

closeModalBtn.addEventListener('click', () => {
  cartModal.style.display = 'none'
})

cartModal.addEventListener('click', (event) => {
  if (event.target === cartModal)
    cartModal.style.display = "none"
})

menu.addEventListener('click', (event) => {
  let parentButton = event.target.closest('.add-to-cart-btn')
  if (parentButton) {
    let name = parentButton.getAttribute('data-name')
    let price = +parentButton.getAttribute('data-price')
    addToCart(name, price)
  }
})

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name)
  if (existingItem) {
    existingItem.quantity += 1
    existingItem.price
  }
  else {
    cart.push({
      name,
      price,
      quantity: 1,
    })
  }
  updateCartModal()

}

function updateCartModal() {
  cartItemsContainer.innerHTML = ''
  let total = 0

  cart.forEach((item) => {
    const cartItemElement = document.createElement('div')
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

    cartItemElement.innerHTML =
      `<div class='flex justify-between'>
          <div>
            <p class=" font-medium ">${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">R$${item.price}</p>
          </div>  
          <div>
          <button class=" text-white bg-red-500 px-4 py-1 h-8 rounded mt-4 remove-from-cart-btn" data-name="${item.name}">
          Remover
          </button>
          </div>
        </div>
      `
    total += item.price * item.quantity
    cartItemsContainer.appendChild(cartItemElement)
  })

  cartTotal.textContent = total.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL'
  })
  cartCounter.innerHTML = cart.length
}

cartItemsContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('remove-from-cart-btn')) {
    const name = event.target.getAttribute('data-name')

    removeItemCart(name)
  }
})

function removeItemCart(name) {
  const index = cart.findIndex(item => item.name === name)

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1
      updateCartModal()
      return
    }
    cart.splice(index, 1)
    updateCartModal()
  }
}

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

})

checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpon();
  if(!isOpen){
    Toastify({
      text: "Restaurante Fechado",
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "left", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "red",
      },
      onClick: function(){} // Callback after click
    }).showToast();
  return;
  }


  if (cart.length === 0) return
  if (addressInput.value === '') {
    addressWarn.classList.remove('hidden')
    addressInput.classList.add('border-red-500')
    return
  }
 
  const cartItems = cart.map((item)=>{
    return (
      `${item.name} Quantidade: (${item.quantity})  Preço: R$${item.price} | ` 
    )
  }).join("")

  const message = encodeURIComponent(cartItems)
  const phone = "558185206275"
  
  window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

  cart.length = 0
})

function checkRestaurantOpon() {
  const data = new Date()
  const hora = data.getHours()
  return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById('date-span')
const isOpen = checkRestaurantOpon();

if(isOpen){
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600")
}else{
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")
}
