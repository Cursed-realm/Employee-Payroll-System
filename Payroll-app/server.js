const express = require('express');
const path = require('path');
const fileHandler = require('./modules/fileHandler');

const app = express();
const PORT = 3000;

// Initialize file handler
fileHandler.initializeFile();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes

// Home - Display all employees
app.get('/', (req, res) => {
    const employees = fileHandler.read();
    const message = req.query.message || null;
    res.render('index', { employees, message });
});

// Add Employee - Show form
app.get('/add', (req, res) => {
    res.render('add', { error: null });
});

// Add Employee - Process form
app.post('/add', (req, res) => {
    try {
        const { name, profileImage, gender, departments, salary, startDay, startMonth, startYear, notes } = req.body;

        // Validation
        if (!name || !name.trim()) {
            return res.render('add', { error: 'Employee name is required' });
        }

        if (!gender) {
            return res.render('add', { error: 'Gender is required' });
        }

        if (!salary) {
            return res.render('add', { error: 'Salary is required' });
        }

        if (!startDay || !startMonth || !startYear) {
            return res.render('add', { error: 'Start date is required' });
        }

        // Get and validate departments
        let deptArray = departments ? (Array.isArray(departments) ? departments : [departments]) : [];
        if (deptArray.length === 0) {
            return res.render('add', { error: 'At least one department must be selected' });
        }

        // Parse salary to number for calculations
        const salaryNum = parseInt(salary);
        const tax = Math.round(salaryNum * 0.12); // 12% tax
        const netSalary = salaryNum - tax;

        // Create employee object
        const employee = {
            id: Date.now().toString(),
            name: name.trim(),
            profileImage: profileImage || null,
            gender,
            departments: deptArray,
            salary: salary,
            basicSalary: salary,
            tax: tax.toString(),
            netSalary: netSalary.toString(),
            startDate: `${startDay} ${startMonth} ${startYear}`,
            notes: notes || ''
        };

        // Add to file
        fileHandler.addEmployee(employee);
        console.log('Employee added:', employee);

        res.redirect('/?message=Employee added successfully!');
    } catch (error) {
        console.error('Error adding employee:', error);
        res.render('add', { error: 'Error adding employee. Please try again.' });
    }
});

// Edit Employee - Show form
app.get('/edit/:id', (req, res) => {
    const employee = fileHandler.getEmployee(req.params.id);

    if (!employee) {
        return res.redirect('/?message=Employee not found');
    }

    res.render('edit', { employee, error: null });
});

// Edit Employee - Process form
app.post('/edit/:id', (req, res) => {
    try {
        const { name, profileImage, gender, departments, salary, startDay, startMonth, startYear, notes } = req.body;
        const employeeId = req.params.id;

        // Validation
        if (!name || !name.trim()) {
            const employee = fileHandler.getEmployee(employeeId);
            return res.render('edit', { employee, error: 'Employee name is required' });
        }

        if (!gender) {
            const employee = fileHandler.getEmployee(employeeId);
            return res.render('edit', { employee, error: 'Gender is required' });
        }

        if (!salary) {
            const employee = fileHandler.getEmployee(employeeId);
            return res.render('edit', { employee, error: 'Salary is required' });
        }

        if (!startDay || !startMonth || !startYear) {
            const employee = fileHandler.getEmployee(employeeId);
            return res.render('edit', { employee, error: 'Start date is required' });
        }

        // Get and validate departments
        let deptArray = departments ? (Array.isArray(departments) ? departments : [departments]) : [];
        if (deptArray.length === 0) {
            const employee = fileHandler.getEmployee(employeeId);
            return res.render('edit', { employee, error: 'At least one department must be selected' });
        }

        // Parse salary to number for calculations
        const salaryNum = parseInt(salary);
        const tax = Math.round(salaryNum * 0.12); // 12% tax
        const netSalary = salaryNum - tax;

        // Create updated employee object
        const updatedEmployee = {
            id: employeeId,
            name: name.trim(),
            profileImage: profileImage || null,
            gender,
            departments: deptArray,
            salary: salary,
            basicSalary: salary,
            tax: tax.toString(),
            netSalary: netSalary.toString(),
            startDate: `${startDay} ${startMonth} ${startYear}`,
            notes: notes || ''
        };

        // Update in file
        fileHandler.updateEmployee(employeeId, updatedEmployee);
        console.log('Employee updated:', updatedEmployee);

        res.redirect('/?message=Employee updated successfully!');
    } catch (error) {
        console.error('Error updating employee:', error);
        const employee = fileHandler.getEmployee(req.params.id);
        res.render('edit', { employee, error: 'Error updating employee. Please try again.' });
    }
});

// Delete Employee
app.post('/delete/:id', (req, res) => {
    try {
        const success = fileHandler.deleteEmployee(req.params.id);

        if (success) {
            console.log('Employee deleted:', req.params.id);
            res.redirect('/?message=Employee deleted successfully!');
        } else {
            res.redirect('/?message=Error: Employee not found');
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.redirect('/?message=Error deleting employee');
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Employee Payroll System running on http://localhost:${PORT}`);
    console.log(`📊 View the dashboard at http://localhost:${PORT}`);
});
