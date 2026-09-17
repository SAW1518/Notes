bash

```bash
ssh-keygen -t ed25519 -C "tu@correo.com"
```

Cuando te pregunte dónde guardarla, solo presiona Enter. Luego te pedirá una contraseña (passphrase). Puedes escribir una o dejarla vacía presionando Enter dos veces. El correo es solo una etiqueta, pero lo normal es usar el de tu cuenta de GitHub.

Después agrega la llave al agente. Veo que estás en Mac, así que esta opción también guarda la contraseña en el Llavero. Si te marca error, usa solo `ssh-add ~/.ssh/id_ed25519`.

bash

```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

Copia la llave pública al portapapeles:

bash

```bash
pbcopy < ~/.ssh/id_ed25519.pub
```

En GitHub ve a **Settings → SSH and GPG keys → New SSH key**. Pega la llave en el campo "Key", ponle un título como "Mi Mac" y guárdala. Luego prueba la conexión:

bash

```bash
ssh -T git@github.com
```