document.addEventListener("DOMContentLoaded", () => {
  // 1. Menú móvil (Hamburguesa)
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      mobileMenuBtn.textContent = navLinks.classList.contains("active")
        ? "✕"
        : "☰";
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        mobileMenuBtn.textContent = "☰";
      });
    });
  }

  // 2. Validación del formulario de reservaciones
  const form = document.getElementById("reservationForm");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevenir envío real para demostración

      let isValid = true;

      // Limpiar mensajes de error previos
      document
        .querySelectorAll(".error-message")
        .forEach((el) => (el.textContent = ""));

      // Validar Nombre
      const nombre = document.getElementById("nombre");
      if (nombre.value.trim().length < 3) {
        showError(
          "error-nombre",
          "El nombre debe tener al menos 3 caracteres.",
        );
        isValid = false;
      }

      // Validar Teléfono (formato básico de 10 dígitos)
      const telefono = document.getElementById("telefono");
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(telefono.value.replace(/\s/g, ""))) {
        showError(
          "error-telefono",
          "Ingresa un número de teléfono válido de 10 dígitos.",
        );
        isValid = false;
      }

      // Validar Email
      const email = document.getElementById("email");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        showError("error-email", "Ingresa un correo electrónico válido.");
        isValid = false;
      }

      // Validar Servicio
      const servicio = document.getElementById("servicio");
      if (!servicio.value) {
        showError("error-servicio", "Por favor, selecciona un servicio.");
        isValid = false;
      }

      // Validar Fecha (no permitir fechas en el pasado)
      const fecha = document.getElementById("fecha");
      const today = new Date().toISOString().split("T")[0];
      if (fecha.value < today) {
        showError("error-fecha", "La fecha no puede ser en el pasado.");
        isValid = false;
      }

      // Validar Hora (dentro del horario de 11:00 a 23:00)
      const hora = document.getElementById("hora");
      if (hora.value) {
        const [hours, minutes] = hora.value.split(":");
        const hourNum = parseInt(hours, 10);
        if (hourNum < 11 || hourNum >= 23) {
          showError(
            "error-hora",
            "El horario debe estar entre 11:00 a.m. y 11:00 p.m.",
          );
          isValid = false;
        }
      }

      // Si todo es válido, mostrar mensaje de éxito
      if (isValid) {
        const successMsg = document.getElementById("formSuccess");
        successMsg.style.display = "block";
        form.reset();

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
          successMsg.style.display = "none";
        }, 5000);

        // Aquí iría tu llamada AJAX/Fetch a tu backend PHP
        // console.log("Datos listos para enviar al servidor:", new FormData(form));
      }
    });

    // Validación en tiempo real (feedback inmediato al salir del campo)
    const inputs = form.querySelectorAll("input, select");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        if (input.checkValidity()) {
          input.style.borderColor = "var(--success)";
        } else if (input.value !== "") {
          input.style.borderColor = "var(--error)";
        }
      });

      input.addEventListener("input", () => {
        if (input.style.borderColor === "var(--error)") {
          input.style.borderColor = "var(--border)";
        }
      });
    });
  }

  // Función auxiliar para mostrar errores
  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = message;
    }
  }
});
