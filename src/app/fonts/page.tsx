"use client";
import Image from "next/image";

import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { IconButton, Skeleton } from "@mui/material";
import { EditNote } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getFonts } from "@/apis/fonts";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/loading-screen";

const ActionButton = ({ id }: { id: string }) => {
  const router = useRouter();
  const handleClick = () => {
    console.log("ID: ", id);
    router.push(`/fonts/${id}`);
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
  { field: "createdAt", headerName: "Created At", flex: 1, type: "date" },
  { field: "updatedAt", headerName: "Updated At", flex: 1, type: "date" },
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

const columns_skeleton: GridColDef[] = [
  {
    field: "id",
    headerName: "Id",
    flex: 1,
    renderCell: (params) => {
      return (
        <Skeleton variant="text" className="w-full" sx={{ height: "100%" }} />
      );
    },
  },
  {
    field: "name",
    headerName: "Name",
    flex: 2,
    renderCell: (params) => {
      return (
        <Skeleton variant="text" className="w-full" sx={{ height: "100%" }} />
      );
    },
  },
  {
    field: "createdAt",
    headerName: "Created At",
    flex: 1,
    renderCell: (params) => {
      return (
        <Skeleton variant="text" className="w-full" sx={{ height: "100%" }} />
      );
    },
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    flex: 1,
    renderCell: (params) => {
      return (
        <Skeleton variant="text" className="w-full" sx={{ height: "100%" }} />
      );
    },
  },
  {
    field: "actions",
    headerName: "",
    sortable: false,
    width: 90,
    renderCell: (params) => {
      return <Skeleton variant="circular" width={30} height={30} />;
    },
  },
];

const rows_skeleton: GridRowsProp = new Array(10).fill(0).map((_, index) => {
  return { id: index };
});

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
      <h1 className="mb-4 text-xl font-bold">Fonts Installed</h1>

      {loading ? (
        <></>
      ) : (
        <DataGrid
          rows={loading ? rows_skeleton : rows}
          columns={loading ? columns_skeleton : columns}
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
