// script.js - Currículo Tech MVP
// Validação + Envio para Google Sheets + Feedback Visual

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("teamForm");
  const submitBtn = document.querySelector(".submit-btn");
  const btnText = document.getElementById("btn-text");
  const btnLoading = document.getElementById("btn-loading");
  const successMessage = document.getElementById("success-message");

  const GOOGLE_APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwJjvK4TFfy9j1QRiNx4Fd7wl4uuzfuoQg2eZegQQzkIGib084GSdoq7uOmKPfwtqzR/exec";

  const showError = (inputWrapper, message) => {
    const input = inputWrapper.querySelector("input, textarea");
    input.classList.add("error");
    const errorEl = document.createElement("div");
    errorEl.className = "error-message";
    errorEl.textContent = message;
    inputWrapper.appendChild(errorEl);
  };

  const clearErrors = () => {
    document
      .querySelectorAll(".error")
      .forEach((el) => el.classList.remove("error"));
    document.querySelectorAll(".error-message").forEach((el) => el.remove());
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidGithub = (github) =>
    /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(github);

  const isValidBirthDate = (dateStr) => {
    const birth = new Date(dateStr);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();
    const adjustedAge =
      monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
    return birth < today && adjustedAge >= 16 && adjustedAge <= 80;
  };

  const submitForm = async (data) => {
    try {
      submitBtn.disabled = true;
      btnText.classList.add("hidden");
      btnLoading.classList.remove("hidden");

      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setTimeout(() => {
        form.classList.add("hidden");
        successMessage.classList.remove("success-hidden");
      }, 800);
    } catch (error) {
      console.error("Erro no envio:", error);
      alert("Erro ao enviar. Tente novamente ou me chama no WhatsApp.");
    } finally {
      submitBtn.disabled = false;
      btnText.classList.remove("hidden");
      btnLoading.classList.add("hidden");
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const githubUsername = document.getElementById("github").value.trim();
    const github = `https://github.com/${githubUsername}`;
    const nascimento = document.getElementById("nascimento").value;
    const conhecimentos = document.getElementById("conhecimentos").value.trim();
    const interesses = document.getElementById("interesses").value.trim();

    let valid = true;

    // Validações
    if (!nome || nome.length < 2) {
      showError(
        document.getElementById("nome").closest(".input-wrapper"),
        "Nome muito curto"
      );
      valid = false;
    }

    if (!isValidEmail(email)) {
      showError(
        document.getElementById("email").closest(".input-wrapper"),
        "Email inválido"
      );
      valid = false;
    }

    if (!isValidGithub(githubUsername)) {
      showError(
        document.getElementById("github").closest(".input-wrapper"),
        "GitHub inválido (apenas o nome de usuário)"
      );
      valid = false;
    }

    if (!nascimento || !isValidBirthDate(nascimento)) {
      showError(
        document.getElementById("nascimento").closest(".input-wrapper"),
        "Data inválida"
      );
      valid = false;
    }

    if (!conhecimentos || conhecimentos.length < 10) {
      showError(
        document.getElementById("conhecimentos").closest(".input-wrapper"),
        "Descreva pelo menos uma habilidade"
      );
      valid = false;
    }

    if (!interesses || interesses.length < 5) {
      showError(
        document.getElementById("interesses").closest(".input-wrapper"),
        "Diga o que quer aprender"
      );
      valid = false;
    }

    if (!valid) return;

    // Dados para envio
    const payload = {
      nome,
      email,
      github, // URL completo
      nascimento,
      conhecimentos,
      interesses,
      timestamp: new Date().toISOString(),
    };

    submitForm(payload);
  });

  const originalText = btnText.textContent;
  let isHovered = false;
  submitBtn.addEventListener("mouseenter", () => {
    if (isHovered || submitBtn.disabled) return;
    isHovered = true;
    let i = 0;
    const text = "Enviar agora!";
    btnText.textContent = "";
    const interval = setInterval(() => {
      if (i < text.length) {
        btnText.textContent += text[i];
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (!submitBtn.disabled) btnText.textContent = originalText;
          isHovered = false;
        }, 1000);
      }
    }, 50);
  });
});
