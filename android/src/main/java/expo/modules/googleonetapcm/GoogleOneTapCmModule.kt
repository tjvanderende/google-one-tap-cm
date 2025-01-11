package expo.modules.googleonetapcm

import android.content.pm.PackageManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

import androidx.credentials.PublicKeyCredential
import androidx.credentials.CustomCredential
import androidx.credentials.PasswordCredential
import androidx.credentials.exceptions.GetCredentialException
import androidx.credentials.GetCredentialRequest
import androidx.credentials.GetCredentialResponse
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenParsingException
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import androidx.credentials.CredentialManager
import kotlinx.coroutines.launch
import expo.modules.googleonetapcm.GoogleOneTapCmType

var TAG = "GoogleOneTapCm"
class GoogleOneTapCmModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  private val coroutineScope = CoroutineScope(Dispatchers.Main + Job())
  private lateinit var credentialManager: CredentialManager
  private var webClientId: String? = null
  private var autoSelectEnabled: Boolean = false
  private var filterByAuthorizedAccounts: Boolean = false

  override fun definition() = ModuleDefinition {
    Name("GoogleOneTapCm")
    Events("onLogin", "onLogout")

    OnCreate {
      val applicationInfo = appContext.reactContext?.packageManager?.getApplicationInfo(appContext.reactContext?.packageName.toString(), PackageManager.GET_META_DATA)
      webClientId = applicationInfo?.metaData?.getString("webClientId")
    }

    AsyncFunction("login") {
      val activity = appContext.currentActivity
            ?: throw Exception("Activity is null")
      
      // Initialize credentialManager if not already initialized
      if (!::credentialManager.isInitialized) {
        credentialManager = CredentialManager.create(activity)
      }
      
      val googleIdOption = initializeGoogleSignIn()

      val request: GetCredentialRequest = GetCredentialRequest.Builder()
        .addCredentialOption(googleIdOption)
        .build()

      coroutineScope.launch {
        try {
          val result = credentialManager.getCredential(
            request = request,
            context = activity,
          )
          handleSignIn(result)
        } catch (e: GetCredentialException) {
          //handleFailure(e)
          Log.e(TAG, "GetCredentialException: ${e.message}")
        }
      }
    }
  }

  fun handleSignIn(result: GetCredentialResponse) {
    // Handle the successfully returned credential.
    val credential = result.credential
    var successBody: Map<String, Any> = emptyMap()
    var successEnum: GoogleOneTapCmType? = null
    when (credential) {
      // Passkey credential
      is PublicKeyCredential -> {
        // Share responseJson such as a GetCredentialResponse on your server to
        // validate and authenticate
        val responseJson = credential.authenticationResponseJson
        Log.d("GoogleOneTapCm", "handleSignIn with public key credential: $responseJson")
        successBody = mapOf(
          "publicKey" to responseJson
        )
        successEnum = GoogleOneTapCmType.PUBLIC_KEY
      }

      // Password credential
      is PasswordCredential -> {
        // Send ID and password to your server to validate and authenticate.
        val username = credential.id
        val password = credential.password
        Log.d("GoogleOneTapCm", "handleSignIn with password credential: $username, $password")
        successBody = mapOf(
          "username" to username,
          "password" to password
        )
        successEnum = GoogleOneTapCmType.PASSWORD
      }

      is CustomCredential -> {
        if (credential.type == GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL) {
          try {
            val googleIdTokenCredential = GoogleIdTokenCredential
              .createFrom(credential.data)
            Log.d("GoogleOneTapCm", "handleSignIn with googleIdTokenCredential: $googleIdTokenCredential")
            successBody = mapOf(
              "googleIdToken" to googleIdTokenCredential.idToken
            )
            successEnum = GoogleOneTapCmType.CUSTOM
          } catch (e: GoogleIdTokenParsingException) {
            Log.e(TAG, "Received an invalid google id token response", e)
            sendEvent("onLogin", mapOf(
              "success" to false,
              "errorBody" to "Received an invalid google id token response"
            ))
            return; 
          }
        }
      }
      else -> {
        // Catch any unrecognized credential type here.
        Log.e(TAG, "Unexpected type of credential")
        sendEvent("onLogin", mapOf(
          "success" to false,
          "errorBody" to "Unexpected type of credential"
        ))
        return;
      }
    }
    Log.d("GoogleOneTapCm", "handleSignIn success: $successEnum, $successBody")

    sendEvent("onLogin", mapOf(
      "success" to true,
      "type" to successEnum,
      "successBody" to successBody
    ))
  }

  fun initializeGoogleSignIn(): GetGoogleIdOption {
    return GetGoogleIdOption.Builder()
      .setFilterByAuthorizedAccounts(true)
      .setServerClientId(webClientId.toString())
      .setAutoSelectEnabled(true)
     // .setNonce(<nonce string to use when generating a Google ID token>)
      .build()
  }
}
