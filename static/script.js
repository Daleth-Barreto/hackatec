// WebSocket con el backend
const socket = new WebSocket("ws://localhost:8000/ws");

socket.onopen = () => {
  console.log("🔌 WebSocket conectado");
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("📨 Datos recibidos:", data);

  // Actualiza la interfaz con los datos recibidos
  document.body.style.backgroundColor = data.background || "#ddeeff";
  document.getElementById('bgColorDisplay').innerText = data.bgText || "Luces suaves azuladas";
  document.getElementById('alexaMessageDisplay').innerText = data.message || "Reproduciendo música relajante y atenuando luces";
  
  const routineStatus = document.getElementById('isActiveDisplay');
  routineStatus.innerText = "Activa";
  routineStatus.classList.remove('off');
  routineStatus.classList.add('on');

  // Reinicio automático tras 10 segundos
  setTimeout(() => {
    document.body.style.backgroundColor = "#f4f4f4";
    document.getElementById('bgColorDisplay').innerText = "Normal";
    document.getElementById('alexaMessageDisplay').innerText = "Ninguno";
    routineStatus.innerText = "Inactiva";
    routineStatus.classList.remove('on');
    routineStatus.classList.add('off');
  }, 10000);
};

socket.onerror = (e) => {
  console.error("❌ Error de WebSocket:", e);
};

// Botón: solo envía la señal para que el backend dispare la notificación
document.getElementById('triggerRoutineBtn').addEventListener('click', async () => {
  try {
    await fetch("http://localhost:8000/trigger", {
      method: "POST"
    });
  } catch (err) {
    document.getElementById('errorMessage').innerText = "Error al contactar al servidor: " + err.message;
  }
});
