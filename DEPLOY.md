# deploy firebase hosting 

## firebase hosting init

```
firebase init hosting
```

### firebase.josn
```
{
  "hosting": {
    "public": "./build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}

```
## build && deploy

```
npm run build
firebase deploy
```