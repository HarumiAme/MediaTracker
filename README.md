# Media Tracker
![image](https://github.com/user-attachments/assets/0a1d2f8c-3896-4987-855e-d6570208622c)
#### [Online version](https://mediatracker-beta.vercel.app)

## QR Code
![mediatracker_small](https://github.com/user-attachments/assets/3719652d-af4f-4364-ae69-2f3bd6ef9e27)

## Instrucciones 
### Clonar proyecto
```bash
git clone https://github.com/HarumiAme/MediaTracker.git
cd MediaTracker
```
### Instalar dependencias
```bash
npm install
```
### Agregar tus clave de API y otros datos de openAI y firebase (en la raíz del proyecto)
```bash
echo "VITE_FIREBASE_API_KEY=[API]" >> .env
echo "VITE_FIREBASE_AUTH_DOMAIN=[DOMAIN]" >> .env
echo "VITE_FIREBASE_PROJECT_ID=[PROJECT_ID]" >> .env
echo "VITE_FIREBASE_STORAGE_BUCKET=[STORAGE_BUCKET]" >> .env
echo "VITE_FIREBASE_MESSAGING_SENDER_ID=[SENDER_ID]" >> .env
echo "VITE_FIREBASE_APP_ID=[APP_ID]" >> .env
```
### Ejecutar
```bash
npm run dev
```

