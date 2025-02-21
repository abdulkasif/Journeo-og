import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#09c2f0", // Changed to blue
  },

  appName: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "white", // Changed to white 
  },
 
  card: {
    backgroundColor: "white",
    marginHorizontal: 30,
    marginVertical: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 10,  // ⬅️ Added more space at the bottom
  },

  
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#09c2f0",
    textAlign: "center",
  },
  
  welcomeDescription: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
    marginTop: 8,
  },

  formCard: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  

  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#09c2f0",
    marginBottom: 10,
  },

  dropdownContainer: { 
    marginTop:0,
    marginBottom: 15,
    padding: 10, // Adds spacing inside the container
    borderRadius: 12, // Smooth rounded corners
    backgroundColor: "#ffffff", // Clean white background
    elevation: 5, // Soft shadow for Android
    shadowColor: "#000", // Shadow effect
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.1,
    shadowRadius: 4, 
  },
  label: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 8, 
    color: "#333", // Slightly darker text for contrast
  },
  picker: { 
    height: 50, 
    backgroundColor: "#f9f9f9", 
    borderRadius: 10, // Smooth edges for dropdown 
    paddingHorizontal: 10, // Space inside the picker
  },
  
  

  generateButton: {
    backgroundColor: "#09c2f0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  generateText: { color: "white", fontSize: 16, fontWeight: "bold" },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContent: {
    width: "85%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#09c2f0",
    marginBottom: 20,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    width: "100%",
    paddingHorizontal: 10,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "black",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },

  detectButton: {
    flex: 1,
    backgroundColor: "#09c2f0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 5,
  },

  buttonText: {
    color: "white",
    fontSize: 14,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 5,
  },

  cancelText: {
    color: "#333",
    fontSize: 14,
  },

  menuBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16, // Increased padding for a cleaner bottom navigation
    backgroundColor: "white",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 8,
  },

  menuItem: { alignItems: "center" },
  menuText: { fontSize: 12, color: "gray" },
  activeText: { color: "#09c2f0", fontWeight: "bold" },
});

export default styles;
