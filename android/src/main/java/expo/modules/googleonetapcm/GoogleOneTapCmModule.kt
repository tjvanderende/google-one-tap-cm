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
import androidx.credentials.ClearCredentialStateRequest
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import androidx.credentials.CredentialManager
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption
import kotlinx.coroutines.launch

var TAG = "GoogleOneTapCm"
class GoogleOneTapCmModule : Module() {
 
  private val coroutineScope = CoroutineScope(Dispatchers.Main + Job())
  private lateinit var credentialManager: CredentialManager
  private var webClientId: String? = null
  private var autoSelectEnabled: Boolean = false
  private var filterByAuthorizedAccounts: Boolean = false
  private lateinit var request: GetCredentialRequest

  override fun definition() = ModuleDefinition {
    Name("GoogleOneTapCm")
    Events("onLogin", "onLogout")
    
    OnCreate {
      val applicationInfo = appContext.reactContext?.packageManager?.getApplicationInfo(appContext.reactContext?.packageName.toString(), PackageManager.GET_META_DATA)
      webClientId = applicationInfo?.metaData?.getString("webClientId")
      val activity = appContext.currentActivity
        ?: throw Exception("Activity is null")

      if (!::credentialManager.isInitialized) {
        credentialManager = CredentialManager.create(activity)
      }
      if (webClientId == null) {
        throw Exception("webClientId is null")
      }
    }

    AsyncFunction("login") {
      val activity = appContext.currentActivity
            ?: throw Exception("Activity is null")
      val googleIdOption = initializeGoogleSignIn()
      
      request = GetCredentialRequest.Builder()
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

    AsyncFunction("logout") {
      handleSignOut()
    }

    AsyncFunction("loginWithButton") {
      val activity = appContext.currentActivity
            ?: throw Exception("Activity is null")
      val googleIdOption = initializeGoogleSignInWithButton()

      request = GetCredentialRequest.Builder()
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
          e.printStackTrace()
          Log.e(TAG, "GetCredentialException: ${e.message}")
          sendEvent("onLogin", mapOf(
            "success" to false,
            "errorBody" to e.message
          ))
        }
      }
    }
  }

  fun handleSignOut() {
    val stateRequest = ClearCredentialStateRequest()
    coroutineScope.launch {
      try {
        credentialManager.clearCredentialState(
          request = stateRequest
        );
        sendEvent("onLogout", mapOf(
          "success" to true
        ))
      } catch (e: Exception) {
        e.printStackTrace()
        sendEvent("onLogout", mapOf(
          "success" to false,
          "errorBody" to e.message
        ))
      }
    }
  }

  fun handleSignIn(result: GetCredentialResponse) {
    // Handle the successfully returned credential.
    val credential = result.credential
    var successBody: Map<String, Any> = emptyMap()
    var successEnum: GoogleOneTapCmType? = null
    when (credential) {
      is PublicKeyCredential -> {
        val responseJson = credential.authenticationResponseJson
        Log.d("GoogleOneTapCm", "handleSignIn with public key credential: $responseJson")
        successBody = mapOf(
          "publicKey" to responseJson
        )
        successEnum = GoogleOneTapCmType.PUBLIC_KEY
      }
      is PasswordCredential -> {
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

  fun initializeGoogleSignInWithButton(): GetSignInWithGoogleOption {
    return GetSignInWithGoogleOption.Builder(webClientId.toString()).build()
  }
}
