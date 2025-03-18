"use client"
import { useState } from 'react';
import { Button, Stack, Container } from 'react-bootstrap';
import DataTable from 'datatables.net-react';
import BS5 from 'datatables.net-bs5';
import 'datatables.net-colreorder-bs5';
import 'datatables.net-datetime';
import 'datatables.net-responsive-bs5';
import 'datatables.net-fixedheader-bs5';
import 'datatables.net-rowgroup-bs5';
import 'datatables.net-searchbuilder-bs5';
import 'datatables.net-searchpanes-bs5';


function BGDataTable({ headers, rows, columnSettings, editCallback, deleteCallback }) {
    DataTable.use(BS5);
    if (!columnSettings) {
        columnSettings = [
            {className: "dt-center", targets: "_all"}
        ]
    }
    console.log(columnSettings);
    let actionButtonColumnIndex = headers.length - 1;
    console.log(`Datatable headers:\n${headers}`);
    console.log(`Datatable rows:\n`);
    console.log(rows);

    function mapRowToHeaders(headers, row) {
        // Filter out the "Actions" header
        const dataHeaders = headers.filter(header => header !== 'Actions');
        // Build the object by mapping each valid header to its corresponding value
        const result = {};
        dataHeaders.forEach((header, index) => {
            result[header] = row[index];
        });
        return result;
    }

    return (
        <DataTable data={rows} options={{columnDefs: columnSettings ? columnSettings : null}} className="display table row-border" slots={{
            [actionButtonColumnIndex]: (data, row) => (
                <Stack direction='horizontal' gap={1}>
                    <Button variant='primary' onClick={() => {
                        editCallback(mapRowToHeaders(headers, row))
                    }}>
                        Edit
                    </Button>
                    <Button variant='danger' onClick={() => {deleteCallback(row)}}>
                        Delete
                    </Button>
                </Stack>
            )
        }}>
            <thead>
                <tr>
                    {headers.map((value, index) => (
                        <th key={index}>{value}</th>
                    ))}
                </tr>
            </thead>
        </DataTable>
    )
}

export default BGDataTable;