// 500ms after page loads,
// clear the console.
setTimeout(() => {
  console.clear()
}, 500)

const topBar = document.getElementById("topBar")
const menuIcon = document.getElementById("menuIcon")
const activeMenuIcon = document.getElementById("activeMenuIcon")
const smallScreenNavLinks = document.getElementById("smallScreenNavLinks")
const allSections = document.querySelectorAll(".sectionContainer")
const allSmallScreeNavLinkAnchors = document.querySelectorAll("#smallScreenNavLinks a")

function toggleDisplayValue(targetElement) {
  const currentDisplayValue = getComputedStyle(targetElement).display
  const isCurrentlyHidden = currentDisplayValue === "none"
  const newValue = isCurrentlyHidden ? "flex" : "none"
  targetElement.style.display = newValue
}

function toggleNavMenu() {
  toggleDisplayValue(smallScreenNavLinks)
  toggleDisplayValue(activeMenuIcon)
}

function dontScroll(event) {
  event.preventDefault()
}

function closeSmallNavLinks() {
  smallScreenNavLinks.style.display = "none"
}

activeMenuIcon.addEventListener("click", toggleNavMenu)
menuIcon.addEventListener("click", toggleNavMenu)
smallScreenNavLinks.addEventListener("mousewheel", dontScroll)

allSmallScreeNavLinkAnchors.forEach((anchorElement) => {
  anchorElement.addEventListener("click", closeSmallNavLinks)
})

/**
 * When the form is submitted, we need to get the
 * data out of the form and send it off to our API
 * to send the contact email.
 */

const contactForm = document.getElementById("contactForm")
const contactFormButton = document.getElementById("contactFormButton")
const contactFirstNameInput = document.getElementById("contactFirstNameInput")
const contactLastNameInput = document.getElementById("contactLastNameInput")
const textareaInput = document.getElementById("textareaInput")
const contactEmailAddressInput = document.getElementById("contactEmailAddressInput")
const contactSuccessMessage = document.getElementById("contactSuccessMessage")

const store = {
  lastContactSubmitTime: 1639614273254,
}

const handleContactFormButtonClick = async (event) => {
  // Throttle form submissions.
  const lastSubmittedTime = localStorage.getItem("lastContantSubmitTime")
  const nowTime = Date.now()
  const timeDifference = nowTime - lastSubmittedTime

  // If lastSubmittedTime is falsey, that means the form
  // has never been submitted from this browser.
  if (lastSubmittedTime && timeDifference < 30000) return

  localStorage.setItem("lastContantSubmitTime", nowTime)

  const firstName = contactFirstNameInput.value
  const lastName = contactLastNameInput.value
  const emailAddress = contactEmailAddressInput.value
  const message = textareaInput.value

  await fetch("/api/contact", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      firstName,
      lastName,
      emailAddress,
      message,
    }),
  })

  contactFirstNameInput.value = ""
  contactLastNameInput.value = ""
  textareaInput.value = ""
  contactEmailAddressInput.value = ""
  toggleDisplayValue(contactSuccessMessage)
}

contactFormButton.addEventListener("click", handleContactFormButtonClick)

/**
 * When nav is open and the user clicks outside
 * of it, close the nav.
 */

document.addEventListener("click", (event) => {
  if (topBar.contains(event.target)) return

  const navDisplayValue = getComputedStyle(smallScreenNavLinks).display
  const isNavOpen = navDisplayValue === "flex"
  isNavOpen && toggleDisplayValue(smallScreenNavLinks)
})
