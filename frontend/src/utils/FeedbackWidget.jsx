import React, { useState } from 'react';
import { Snackbar, Box, Typography, Rating, IconButton, Paper, TextField, Button, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

const FeedbackWidget = ({ open, handleClose, feature }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showSuccess, showError } = useNotification(); 

  const handleRate = (event, newValue) => {
    if (!newValue || submitting) return;
    setRating(newValue);
  };
  const handleEnviarFeedback = async () => {
    if (!rating || submitting) return;
    setSubmitting(true);

    try {
      await api.post('/feedback', { 
        feature: feature, 
        rating: rating, 
        comment: comment // Agora mandamos o texto de verdade!
      });
      
      showSuccess('Obrigado pelo seu feedback! Isso nos ajuda a melhorar o SisLab.');
      
      setTimeout(() => {
        onManualClose();
      }, 500);

    } catch (error) {
      showError('Poxa, não conseguimos enviar sua avaliação agora.');
      setSubmitting(false);
    }
  };

  // Limpa tudo ao fechar para a próxima vez que o Widget abrir
  const onManualClose = () => {
    setRating(0);
    setComment('');
    setSubmitting(false);
    handleClose(); // Função que vem da tela pai (ex: faz o navigate('/reservas'))
  };

return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{ zIndex: 9998 }}
    >
      <Paper 
        elevation={6} 
        sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1.5, 
          minWidth: 320, // Aumentei um pouquinho para o texto caber melhor
          bgcolor: 'background.paper', 
          borderRadius: 2,
          borderLeft: '4px solid #1976d2' 
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
              Avalie sua experiência
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Quão fácil foi realizar esta ação?
            </Typography>
          </Box>
          <IconButton size="small" onClick={onManualClose} sx={{ mt: -0.5, mr: -0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.5 }}>
          <Rating
            name="feedback-rating"
            value={rating}
            onChange={handleRate}
            size="large"
            disabled={submitting}
          />
        </Box>

        {rating > 0 && (
          <Fade in={rating > 0}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField
                size="small"
                multiline
                rows={2}
                placeholder="Conte pra gente o motivo da sua nota... (Opcional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={submitting}
                fullWidth
                sx={{
                  '& .MuiInputBase-root': { fontSize: '0.875rem' }
                }}
              />
              <Button 
                variant="contained" 
                size="small" 
                onClick={handleEnviarFeedback}
                disabled={submitting}
                disableElevation
                fullWidth
              >
                {submitting ? 'Enviando...' : 'Enviar Avaliação'}
              </Button>
            </Box>
          </Fade>
        )}

      </Paper>
    </Snackbar>
  );
};

export default FeedbackWidget;