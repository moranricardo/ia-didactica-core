import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert
} from 'react-native';
import { solicitarLeccion } from '../services/api.js';

export default function PantallaLeccion() {
  const [tema, setTema] = useState('');
  const [nivel, setNivel] = useState('principiante');
  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleGenerarLeccion = async () => {
    if (!tema.trim()) {
      Alert.alert('Atención', 'Por favor ingresa un tema para generar la lección.');
      return;
    }

    setCargando(true);
    setRespuesta(null);

    try {
      const data = await solicitarLeccion(tema, nivel);
      if (data && (data.respuesta || data.contenido)) {
        setRespuesta(data);
      } else {
        throw new Error('Formato de respuesta no válido.');
      }
    } catch (error) {
      Alert.alert(
        'Error de Conexión',
        'No se pudo establecer comunicación con el servidor de IA.'
      );
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
        editable={!cargando}
      />

      <View style={styles.selectorContainer}>
        {['principiante', 'intermedio', 'avanzado'].map((item) => (
          <Text
            key={item}
            style={[styles.selectorItem, nivel === item && styles.selectorActive]}
            onPress={() => setNivel(item)}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </Text>
        ))}
      </View>

      <Button
        title={cargando ? 'Generando...' : 'Crear Lección'}
        onPress={handleGenerarLeccion}
        disabled={cargando || !tema.trim()}
      />

      {cargando && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}

      <ScrollView style={styles.resultContainer}>
        {respuesta && (
          <View style={styles.card}>
            <Text style={styles.badge}>Fuente: {respuesta.fuente || 'IA Core'}</Text>
            <Text style={styles.text}>{respuesta.respuesta || respuesta.contenido}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40, backgroundColor: '#f9f9f9' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#111' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 10, borderRadius: 8, backgroundColor: '#fff' },
  selectorContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  selectorItem: { padding: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, fontSize: 12, backgroundColor: '#fff', textTransform: 'capitalize' },
  selectorActive: { backgroundColor: '#007bff', color: '#fff', borderColor: '#007bff', fontWeight: 'bold' },
  loader: { marginTop: 20 },
  resultContainer: { marginTop: 15 },
  card: { padding: 15, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0' },
  badge: { backgroundColor: '#e2e8f0', color: '#334155', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginBottom: 10, fontSize: 12, fontWeight: '600' },
  text: { fontSize: 15, lineHeight: 22, color: '#333' }
});
