![](src/image/Firebase_LoginGoogle_React.png)
# React Native + Login Google + Firebase + Android
Olá pessoal, depois de ter muitos problemas para conseguir implementar no meu aplicativo, a funcionalidade de login utilizando o Google, salvando no Firebase, decidi criar esse tutorial.
Nas minhas pesquisas, encontrei muita infoormação pela metade, ou desatualizada. Além de disponibulizar os fontes, criei uma passo a passo sem erros. :)

**OBS: Este tutorial engloba apenas projetos a partir da versão 0.60 do RN(React Native) e o Android.**

1. **Criando Projeto React Native, add dependências e ajustando arquivos no projeto.**
   - **react-native init login_google_firebase_android**
   - **npm add firebase** dependência para o Firebase
   - **npm add @react-native-firebase/app**
   - **npm add @react-native-firebase/auth** dependência para o módulo Firebase Auth para RN
   - **npm add @react-native-community/google-signin** dependência do google signin para o RN
   - **react-native link @react-native-community/google-signin**  comando para você fazer o link da depenência do google signin, pois ainda não funciona com autolink. 
<br />
A partir daqui, se você fazer o build do seu projeto, ele não vai abrir, pois precisamos configurar algumas coisinhas para que a
lib(google-signin) funcione direitinho.
<br />
Precisamos acessar a pasta **android** dentro do projeto e abrir o arquivo **build.gradle** no seguinte caminho:
  **\login_google_firebase_android\android**
