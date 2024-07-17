import React, { useState } from 'react';
import './Segment.css';

const Segment = () => {
  const [segmentName, setSegmentName] = useState('');
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState('');

  const schemaOptions = [
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
  ];

  const handleAddSchema = () => {
    if (selectedSchema && !schemas.includes(selectedSchema)) {
      setSchemas([...schemas, selectedSchema]);
      setSelectedSchema('');
    }
  };

  const handleRemoveSchema = (indexToRemove) => {
    setSchemas(schemas.filter((_, index) => index !== indexToRemove));
  };

  const handleSaveSegment = async () => {
    const segmentData = {
      segment_name: segmentName,
      schema: schemas.map(schema => {
        const option = schemaOptions.find(option => option.value === schema);
        return { [schema]: option.label };
      })
    };
    
    console.log(segmentData);

    const response = await fetch('https://webhook.site/4956699d-e625-4688-a204-89638bf5d2ec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(segmentData),
    });

    if (response.ok) {
      console.log('Segment saved successfully');
    } else {
      console.error('Error saving segment');
    }
  };

  const handleRefresh = () => {
    setSchemas([]);
    setSelectedSchema('');
    setSegmentName('');
  };

  return (
    <div className="App">
      <button id="save_segment" onClick={() => document.getElementById('popup').style.display = 'block'}>Save Segment</button>
      <div id="popup" style={{ display: 'none' }}>
        <h2>Saving Segment</h2>
        <input
          type="text"
          placeholder="Name of the segment"
          value={segmentName}
          onChange={(e) => setSegmentName(e.target.value)}
        />
        <p>To save your segment, you need to add the schemas to build the query</p>
        <div className="schema-container">
          <div className='schema-items'>
          {schemas.map((schema, index) => (
            <div key={index} className="schema-item">
              <select
                value={schema}
                onChange={(e) => {
                  const newSchemas = [...schemas];
                  newSchemas[index] = e.target.value;
                  setSchemas(newSchemas);
                }}
              >
                {schemaOptions.filter(option => !schemas.includes(option.value) || option.value === schema).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button onClick={() => handleRemoveSchema(index)}>Remove</button>
            </div>
          ))}
          </div>
          <div className="add-schema">
            <select value={selectedSchema} onChange={(e) => setSelectedSchema(e.target.value)}>
              <option value="">Add schema to segment</option>
              {schemaOptions
                .filter((option) => !schemas.includes(option.value))
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
            <button onClick={handleAddSchema}>+ Add new schema</button>
          </div>
        </div>
        <button onClick={handleSaveSegment} id="save_the_segment">Save the Segment</button>
        <button id="cancel" onClick={() => document.getElementById('popup').style.display = 'none'}>Cancel</button>
        <button onClick={handleRefresh}>Refresh</button>
      </div>
    </div>
  );
};

export default Segment;
