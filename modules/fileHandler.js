const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../employees.json');

// Initialize employees.json if it doesn't exist
const initializeFile = () => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    }
};

// Read all employees
const read = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading employees file:', error);
        return [];
    }
};

// Write employees data
const write = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing to employees file:', error);
        return false;
    }
};

// Add new employee
const addEmployee = (employee) => {
    try {
        const employees = read();
        employee.id = Date.now().toString();
        employees.push(employee);
        write(employees);
        return employee;
    } catch (error) {
        console.error('Error adding employee:', error);
        return null;
    }
};

// Get employee by ID
const getEmployee = (id) => {
    try {
        const employees = read();
        return employees.find(emp => emp.id === id);
    } catch (error) {
        console.error('Error getting employee:', error);
        return null;
    }
};

// Update employee
const updateEmployee = (id, updatedData) => {
    try {
        const employees = read();
        const index = employees.findIndex(emp => emp.id === id);
        if (index !== -1) {
            employees[index] = { ...employees[index], ...updatedData };
            write(employees);
            return employees[index];
        }
        return null;
    } catch (error) {
        console.error('Error updating employee:', error);
        return null;
    }
};

// Delete employee
const deleteEmployee = (id) => {
    try {
        const employees = read();
        const index = employees.findIndex(emp => emp.id === id);
        if (index !== -1) {
            employees.splice(index, 1);
            write(employees);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting employee:', error);
        return false;
    }
};

module.exports = {
    initializeFile,
    read,
    write,
    addEmployee,
    getEmployee,
    updateEmployee,
    deleteEmployee
};
