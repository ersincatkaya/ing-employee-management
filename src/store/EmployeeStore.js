export const EmployeeStore = {
  employees: [],

  addEmployee(employee) {
    this.employees.push(employee);
    this.saveToStorage();
  },

  updateEmployee(updated) {
    const index = this.employees.findIndex((emp) => emp.id === updated.id);
    if (index !== -1) {
      this.employees[index] = updated;
      this.saveToStorage();
    }
  },

  deleteEmployee(id) {
    this.employees = this.employees.filter((emp) => emp.id !== id);
    this.saveToStorage();
  },

  saveToStorage() {
    localStorage.setItem('employees', JSON.stringify(this.employees));
  },

  loadFromStorage() {
    const stored = localStorage.getItem('employees');
    if (stored) {
      this.employees = JSON.parse(stored);
    }
  },
};

// Load immediately
EmployeeStore.loadFromStorage();
