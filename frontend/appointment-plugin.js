class AppointmentPlugin {
    constructor(apiUrl) {
      this.apiUrl = apiUrl;
      this.init();
    }
  
    async init() {
      this.renderUI();
      this.addEventListeners();
    }
  
    renderUI() {
      const container = document.getElementById("appointment-plugin");
      container.innerHTML = `
        <h2>Book Appointment</h2>
        <label for="name">Name:</label>
        <input type="text" id="name" placeholder="Enter your name" required />
        
        <label for="phone">Phone:</label>
        <input type="tel" id="phone" placeholder="Enter your phone" required />
        
        <label for="date">Date:</label>
        <input type="date" id="date" required />
        
        <label for="time-slot">Time Slot:</label>
        <select id="time-slot"></select>
        
        <button id="book-appointment">Book Appointment</button>
      `;
    }
  
    async addEventListeners() {
      document.getElementById("date").addEventListener("change", async (e) => {
        const date = e.target.value;
        const slots = await this.fetchAvailableSlots(date);
        this.populateTimeSlots(slots);
      });
  
      document.getElementById("book-appointment").addEventListener("click", async () => {
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const date = document.getElementById("date").value;
        const timeSlot = document.getElementById("time-slot").value;
  
        if (!name || !phone || !date || !timeSlot) {
          alert("Please fill in all fields!");
          return;
        }
  
        const response = await this.bookAppointment({ name, phone, date, timeSlot });
        alert(response.message);
      });
    }
  
    async fetchAvailableSlots(date) {
      const response = await fetch(`${this.apiUrl}/available-slots?date=${date}`);
      return response.json();
    }
  
    async bookAppointment(data) {
      const response = await fetch(`${this.apiUrl}/book-appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    }
  
    populateTimeSlots(slots) {
      const timeSlotSelect = document.getElementById("time-slot");
      timeSlotSelect.innerHTML = slots
        .map((slot) => `<option value="${slot}">${slot}</option>`)
        .join("");
    }
  }
  
  // Initialize the plugin
  new AppointmentPlugin("http://localhost:3000/api");
  