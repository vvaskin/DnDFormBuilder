import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { getForms, createForm, getFormById, deleteForm, updateForm, createResponse } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// '/create' are handled by the client

app.put('/create/:id', async (req, res) => {
    const id = req.params.id;
    console.log('ID: ', id);
    const {title, components} = req.body;
    console.log('---Current form components--- \n', JSON.stringify(components, null, 2));
    const updatedForm = await updateForm(id, title, components);
    res.status(203).json({
        success: true,
        message: 'Form updated successfully',
    });
});

// Save the form in the create tab
app.post('/create/save', async (req, res) => {
    try {
        const {title, formComponents} = req.body;
        const formId = await createForm(title, formComponents);
        res.status(201).json({ 
            success: true, 
            message: 'Form saved successfully',
            id: formId,
        });
    } catch (error) {
        console.error('Error saving form:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Save the form response
app.post('/forms/:id/responses', async (req, res) => {
    try {
        const formId = req.params.id;
        const { answers } = req.body;

        if (!answers) {
            return res.status(400).json({ success: false, message: 'Missing answers data in request body' });
        }

        const responseId = await createResponse(formId, answers);
        res.status(201).json({ 
            success: true, 
            message: 'Response saved successfully',
            id: responseId,
        });
    } catch (error) {
        console.error('Error saving response:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to save response',
            error: error.message
        });
    }
});

// Get the form by id
app.get('/forms/:id', async (req, res) => {
    const formId = req.params.id;
    const form = await getFormById(formId);
    res.json(form);
});

// Get all forms
app.get('/forms', async (req, res) => {
    try {
        const forms = await getForms();
        res.json(forms);
        console.log(forms);
    }
    catch (error) {
        console.error('Error fetching forms:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
    
})

app.delete('/forms/:id', async (req, res) => {
    const formId = req.params.id;
    const deletedForm = await deleteForm(formId);
    res.status(204).json({
        success: true,
        message: 'Form deleted successfully',
    });
})

app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})

