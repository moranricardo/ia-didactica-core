import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { solicitarLeccion } from '../services/api';

export default function PantallaLeccion() {
  const [tema, setTema] = useState('');
  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleGenerarLeccion = async () => {
    if (!tema.trim()) return;
    
    setCargando(true);
    setRespuesta(null);
    
    try {
      const data = await solicitarLeccion(tema, 'principiante');
      setRespuesta(data);
    } catch (error) {
      alert('Hubo un problema de conexión con el servidor IA.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generador de Lecciones IA</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Ej. Promesas en JavaScript..."
        value={tema}
        onChangeText={setTema}
      />
      
      <Button 
        title={cargando ? "Generando..." : "Crear Lección"} 
        onPress={handleGenerarLeccion} 
        disabled={cargando}
      />

      {cargando && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}

      <ScrollView style={styles.resultContainer}>
        {respuesta && (
          <>
            <Text style={styles.badge}>Fuente: {respuesta.fuente}</Text>
            <Text style={styles.text}>{respuesta.respuesta}</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  loader: { marginTop: 20 },
  resultContainer: { marginTop: 20 },
  badge: { backgroundColor: '#e0e0e0', alignSelf: 'flex-start', padding: 5, borderRadius: 5, marginBottom: 10, fontSize: 12 },
  text: { fontSize: 16, lineHeight: 24 }
});
