import {reactive} from '@lit/reactive-element';

export const EmployeeStore = reactive({
  employees: [],

  addEmployee(employee) {
    this.employees = [...this.employees, employee];
    this.saveToStorage();
  },

  updateEmployee(updated) {
    this.employees = this.employees.map((emp) =>
      emp.id === updated.id ? updated : emp
    );
    this.saveToStorage();
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
});
