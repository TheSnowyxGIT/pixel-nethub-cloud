"use client";
import Image from "next/image";

import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { IconButton, Skeleton } from "@mui/material";
import { EditNote } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getFonts } from "@/apis/fonts";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/loading-screen";
import Link from "next/link";

const ActionButton = ({ id }: { id: string }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/fonts/details/${id}`);
  };

  return (
    <IconButton onClick={handleClick} color="default">
      <EditNote />
    </IconButton>
  );
};

const columns: GridColDef[] = [
  { field: "id", headerName: "Id", flex: 1 },
  { field: "name", headerName: "Name", flex: 2 },
  {
    field: "createdAt",
    headerName: "Created At",
    flex: 1,
    type: "date",
    valueFormatter: ({ value }) => new Date(value).toLocaleString(),
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    flex: 1,
    type: "date",
    valueFormatter: ({ value }) => new Date(value).toLocaleString(),
  },
  {
    field: "actions",
    headerName: "",
    sortable: false,
    width: 90,
    renderCell: (params) => {
      return <ActionButton id={params.row.id as string} />;
    },
  },
];

export default function Fonts() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<GridRowsProp>([]);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      const fonts = await getFonts();
      setRows(fonts);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen p-6 lg:p-24 relative">
      {loading && <LoadingScreen text="Loading fonts..." />}
      <div className="flex justify-between">
        <h1 className="mb-4 text-xl font-bold">Fonts Installed</h1>
        <Link href="/fonts/new">Create New Font</Link>
      </div>

      {loading ? (
        <></>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: pageSize,
              },
            },
          }}
          pageSizeOptions={[pageSize]}
          checkboxSelection={!loading}
          disableRowSelectionOnClick
          hideFooter={loading}
        />
      )}
    </main>
  );
}
