import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table"; // ✅ works in .js/.jsx

const HistoryPage = () => {
    const [user, setUser] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOption, setFilterOption] = useState("all");
    const [sorting, setSorting] = useState([]);


    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get("http://localhost:5000/api/profile", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setUser(res.data);
                fetchPredictions(res.data._id);
            })
            .catch((err) => console.error("Error loading profile", err));
    }, []);

    const fetchPredictions = (userId) => {
        axios
            .get(`http://localhost:5000/api/predictions/user/${userId}`)
            .then((res) => setPredictions(res.data))
            .catch((err) => console.error("Error fetching predictions", err));
    };

    const filteredData = useMemo(() => {
        return predictions
            .filter((p) => {
                const predictionText = p.prediction === 1 ? "Risk" : "No Risk";
                return predictionText.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .filter((p) => {
                if (filterOption === "risk") return p.prediction === 1;
                if (filterOption === "norisk") return p.prediction === 0;
                return true;
            });
    }, [predictions, searchTerm, filterOption]);

    const columns = [
        {
            header: "#",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "createdAt",
            header: "Date",
            cell: (info) => new Date(info.getValue()).toLocaleDateString(),
        },
        {
            accessorKey: "prediction",
            header: "Prediction",
            cell: (info) => (info.getValue() === 1 ? "Risk" : "No Risk"),
        },
        {
            accessorKey: "sysBP",
            header: "Systolic",
        },
        {
            accessorKey: "diaBP",
            header: "Diastolic",
        },
    ];


    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            sorting,

        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    if (!user) {
        return (
            <div className="text-center py-10 text-gray-600 dark:text-gray-300">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 py-10 text-gray-900 dark:text-white text-xl">
            <div className="w-full max-w-6xl mx-auto bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
                <div className="">
                    <h2 className="text-5xl font-bold text-center text-primary dark:text-primary mb-6">Prediction History</h2>

                    {/* Filter Row */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Search (e.g. Risk, No Risk)"
                            className="w-full md:w-1/1 p-2 border rounded dark:bg-neutral-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto border rounded-md">
                        <table className="min-w-full table-auto text-xl">
                            <thead className="bg-gray-200 dark:bg-neutral-700 text-left text-xl uppercase">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th key={header.id} className="p-2 font-semibold">
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="border-t">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="p-2">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                {table.getRowModel().rows.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            className="text-center text-gray-500 p-4"
                                        >
                                            No matching records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between gap-4 mt-4">
                        {/* Right: Pagination buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                className="px-3 py-1 border rounded"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="px-3 py-1 border rounded"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default HistoryPage;
