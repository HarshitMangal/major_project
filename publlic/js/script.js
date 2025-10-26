// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      // Trim text-like inputs before validation so whitespace doesn't bypass required/format checks
      const textables = form.querySelectorAll('input[type="text"], input[type="email"], input[type="search"], input[type="tel"], input[type="url"], textarea, input[type="number"]')
      textables.forEach(el => { el.value = el.value.trim() })

      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)

    // Remove validation state while the user is editing so the form revalidates live
    form.addEventListener('input', () => {
      if (form.classList.contains('was-validated')) {
        form.classList.remove('was-validated')
      }
    }, false)
  })
})()