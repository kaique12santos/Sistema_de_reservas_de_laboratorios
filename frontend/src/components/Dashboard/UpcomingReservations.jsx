import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

export default function UpcomingReservations({ reservations }) {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
          Minhas Próximas Reservas
        </Typography>
        <Button size="small" onClick={() => navigate('/reservas')} sx={{ fontWeight: 'bold' }}>
          Ver todas
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {reservations.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: '1px dashed #ccc', borderRadius: 2 }}>
            <Typography sx={{ color: "text.secondary", mb: 2 }}>
              Você não possui reservas aprovadas para os próximos dias.
            </Typography>
            <Button variant="outlined" onClick={() => navigate('/reservas/nova')}>
              + Criar Reserva
            </Button>
          </Paper>
        ) : (
          reservations.map((row) => (
            <Paper
              key={row.id}
              elevation={1}
              sx={{
                py: 2, px: 3, borderRadius: 2,
                borderLeft: "4px solid", borderColor: "success.main",
                display: "flex", flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" }, gap: { xs: 1.5, sm: 0 },
              }}
            >
              <Box sx={{ width: { xs: "100%", sm: "25%" } }}>
                <Typography variant="caption" sx={{ display: "block", color: "text.secondary", fontWeight: "bold" }}>DATA</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {dayjs(row.date).format('DD/MM/YYYY')}
                </Typography>
              </Box>
              <Box sx={{ width: { xs: "100%", sm: "30%" } }}>
                <Typography variant="caption" sx={{ display: "block", color: "text.secondary", fontWeight: "bold" }}>LAB / SALA</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {row.lab_name}
                </Typography>
              </Box>
              <Box sx={{ width: { xs: "100%", sm: "25%" } }}>
                <Typography variant="caption" sx={{ display: "block", color: "text.secondary", fontWeight: "bold" }}>HORÁRIO</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {row.time_slot_name || `${String(row.start_time).slice(0,5)} às ${String(row.end_time).slice(0,5)}`}
                </Typography>
              </Box>
              <Box sx={{ width: { xs: "100%", sm: "20%" }, textAlign: { xs: "left", sm: "right" } }}>
                <Chip 
                  label={row.type === 'SINGLE' ? 'Simples' : 'Recorrente'} 
                  size="small" variant="outlined" color="primary" 
                />
              </Box>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
}