import React from 'react';
import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';

export default function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <Card elevation={1} sx={{ height: '100%', borderRadius: 2, borderLeft: `4px solid ${color}` }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 'bold', mb: 1, textTransform: 'uppercase' }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: '900', color: color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 48, height: 48 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}