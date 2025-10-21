import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';

// --- 1. DATA MODELS ---

// Model for Pharmacy Search (Unchanged)
class PharmacySearchResult {
  final int id;
  final String name;
  final String address;
  final String phone;

  PharmacySearchResult({
    required this.id,
    required this.name,
    required this.address,
    required this.phone,
  });

  factory PharmacySearchResult.fromJson(Map<String, dynamic> json) {
    return PharmacySearchResult(
      id: json['id'] as int,
      name: json['name'] as String,
      address: json['address'] as String,
      phone: json['phone'] as String,
    );
  }
}

// NEW Model for simple Medicine Search (flat result from Medicine table)
class MedicineDetailsResult {
  final int id;
  final String name;
  final String manufacturer;
  final String description;

  MedicineDetailsResult({
    required this.id,
    required this.name,
    required this.manufacturer,
    required this.description,
  });

  factory MedicineDetailsResult.fromJson(Map<String, dynamic> json) {
    return MedicineDetailsResult(
      id: json['id'] as int,
      name: json['name'] as String,
      // Backend must provide Manufacturer and Description for this model to work
      manufacturer: json['manufacturer'] as String? ?? 'N/A',
      description: json['description'] as String? ?? 'No description provided.',
    );
  }
}

// NOTE: MedicineStock and MedicineAvailabilityResult models are no longer used for the search,
// but are kept here to avoid errors if other parts of the app rely on them.

class MedicineStock {
  final int medicineId;
  final String medicineName;
  final int quantity;
  final double price;

  MedicineStock({
    required this.medicineId,
    required this.medicineName,
    required this.quantity,
    required this.price,
  });

  factory MedicineStock.fromJson(Map<String, dynamic> json) {
    return MedicineStock(
      medicineId: json['medicineId'] as int,
      medicineName: json['medicineName'] as String,
      quantity: json['quantity'] as int,
      price: (json['price'] as num).toDouble(),
    );
  }
}

class MedicineAvailabilityResult {
  final int pharmacyId;
  final String pharmacyName;
  final String pharmacyAddress;
  final List<MedicineStock> availableMedicines;

  MedicineAvailabilityResult({
    required this.pharmacyId,
    required this.pharmacyName,
    required this.pharmacyAddress,
    required this.availableMedicines,
  });

  factory MedicineAvailabilityResult.fromJson(Map<String, dynamic> json) {
    var list = json['availableMedicines'] as List;
    List<MedicineStock> stocks =
        list.map((i) => MedicineStock.fromJson(i)).toList();

    return MedicineAvailabilityResult(
      pharmacyId: json['pharmacyId'] as int,
      pharmacyName: json['pharmacyName'] as String,
      pharmacyAddress: json['pharmacyAddress'] as String,
      availableMedicines: stocks,
    );
  }
}

// --- 2. SERVICE CLASS ---

class PharmacyService {
  // MODIFIED FOR WINDOWS DESKTOP: Use localhost since the app and API run on the same OS.
  // Use 'http://10.0.2.2:5035/api/Pharmacy' for Android Emulator only.
  static const String _baseUrl = 'http://localhost:5035/api/Pharmacy';

  // 1. Search Pharmacies by Name (Unchanged)
  Future<List<PharmacySearchResult>> searchPharmacies(String name) async {
    final response = await http.get(Uri.parse('$_baseUrl/search?name=$name'));

    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      return body
          .map((dynamic item) => PharmacySearchResult.fromJson(item))
          .toList();
    } else {
      throw Exception('Failed to load pharmacies: ${response.statusCode}');
    }
  }

  // 2. Search Medicine by Name (MODIFIED: Now expects flat list from Medicine table)
  Future<List<MedicineDetailsResult>> searchMedicinesByName(
      String medicineName) async {
    // Reusing the existing endpoint path, assuming backend is configured to return flat results
    final response = await http
        .get(Uri.parse('$_baseUrl/search/medicine?medicineName=$medicineName'));

    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      // Use the new, simpler model for parsing
      return body
          .map((dynamic item) => MedicineDetailsResult.fromJson(item))
          .toList();
    } else {
      throw Exception('Failed to load medicine list: ${response.statusCode}');
    }
  }
}

// --- 3. MAIN APP STRUCTURE ---

void main() {
  runApp(const PharmacyCustomerApp());
}

class PharmacyCustomerApp extends StatelessWidget {
  const PharmacyCustomerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Customer Pharmacy App',
      theme: ThemeData(
        primarySwatch: Colors.teal,
        visualDensity: VisualDensity.adaptivePlatformDensity,
        useMaterial3: true,
      ),
      home: const CustomerDashboard(),
    );
  }
}

// --- 4. CUSTOMER DASHBOARD UI ---

class CustomerDashboard extends StatefulWidget {
  const CustomerDashboard({super.key});

  @override
  State<CustomerDashboard> createState() => _CustomerDashboardState();
}

class _CustomerDashboardState extends State<CustomerDashboard> {
  final PharmacyService _service = PharmacyService();

  // State for Pharmacy Search (Unchanged)
  final TextEditingController _pharmacyController = TextEditingController();
  List<PharmacySearchResult> _pharmacyResults = [];
  bool _isPharmacyLoading = false;
  String? _pharmacyError;

  // State for Medicine Search (MODIFIED: Uses the simple details model)
  final TextEditingController _medicineController = TextEditingController();
  List<MedicineDetailsResult> _medicineResults = [];
  bool _isMedicineLoading = false;
  String? _medicineError;

  // --- Search Logic ---

  Future<void> _searchPharmaciesByName() async {
    final name = _pharmacyController.text.trim();
    if (name.isEmpty) return;

    setState(() {
      _isPharmacyLoading = true;
      _pharmacyError = null;
      _pharmacyResults = [];
    });

    try {
      final results = await _service.searchPharmacies(name);
      setState(() {
        _pharmacyResults = results;
        if (results.isEmpty) {
          _pharmacyError = 'No approved pharmacies found matching "$name".';
        }
      });
    } catch (e) {
      setState(() {
        _pharmacyError = 'Error fetching data. Check server status.';
        print('Error: $e');
      });
    } finally {
      setState(() {
        _isPharmacyLoading = false;
      });
    }
  }

  // MODIFIED: Search Medicines by Name (Queries Medicine table)
  Future<void> _searchMedicinesByName() async {
    final name = _medicineController.text.trim();
    if (name.isEmpty) return;

    setState(() {
      _isMedicineLoading = true;
      _medicineError = null;
      _medicineResults = [];
    });

    try {
      final results =
          await _service.searchMedicinesByName(name); // <-- New service call
      setState(() {
        _medicineResults = results;
        if (results.isEmpty) {
          _medicineError =
              'No medicines found in the central catalog matching "$name".';
        }
      });
    } catch (e) {
      setState(() {
        _medicineError = 'Error fetching data. Check server status.';
        print('Error: $e');
      });
    } finally {
      setState(() {
        _isMedicineLoading = false;
      });
    }
  }

  // --- UI Building Blocks ---

  Widget _buildPharmacySearchSection() {
    return Card(
      elevation: 4,
      margin: const EdgeInsets.symmetric(vertical: 10),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('Search Pharmacies (by Name)',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.teal)),
            const SizedBox(height: 10),
            TextField(
              controller: _pharmacyController,
              decoration: InputDecoration(
                labelText: 'Pharmacy Name',
                border: const OutlineInputBorder(
                    borderRadius: BorderRadius.all(Radius.circular(10))),
                prefixIcon: const Icon(Icons.local_pharmacy),
                suffixIcon: _pharmacyController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _pharmacyController.clear();
                          setState(() {
                            _pharmacyResults = [];
                            _pharmacyError = null;
                          });
                        },
                      )
                    : null,
              ),
              onSubmitted: (_) => _searchPharmaciesByName(),
            ),
            const SizedBox(height: 15),
            ElevatedButton.icon(
              onPressed: _isPharmacyLoading ? null : _searchPharmaciesByName,
              icon: _isPharmacyLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2))
                  : const Icon(Icons.search),
              label: Text(
                  _isPharmacyLoading ? 'Searching...' : 'Search Pharmacies'),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 10),
            if (_pharmacyError != null)
              Padding(
                padding: const EdgeInsets.only(top: 8.0),
                child: Text(_pharmacyError!,
                    style: const TextStyle(
                        color: Colors.red, fontStyle: FontStyle.italic)),
              ),
            if (_pharmacyResults.isNotEmpty)
              ..._pharmacyResults
                  .map((p) => ListTile(
                        title: Text(p.name,
                            style:
                                const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text('${p.address}\n${p.phone}'),
                        leading:
                            const Icon(Icons.location_on, color: Colors.teal),
                        isThreeLine: true,
                      ))
                  .toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildMedicineSearchSection() {
    return Card(
      elevation: 4,
      margin: const EdgeInsets.symmetric(vertical: 10),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('Search Medicines (Central Catalog)',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.teal)),
            const SizedBox(height: 10),
            TextField(
              controller: _medicineController,
              decoration: InputDecoration(
                labelText: 'Medicine Name',
                hintText: 'e.g., Paracetamol, Aspirin',
                border: const OutlineInputBorder(
                    borderRadius: BorderRadius.all(Radius.circular(10))),
                prefixIcon: const Icon(Icons.medical_services),
                suffixIcon: _medicineController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _medicineController.clear();
                          setState(() {
                            _medicineResults = [];
                            _medicineError = null;
                          });
                        },
                      )
                    : null,
              ),
              onSubmitted: (_) => _searchMedicinesByName(),
            ),
            const SizedBox(height: 15),
            ElevatedButton.icon(
              onPressed: _isMedicineLoading
                  ? null
                  : _searchMedicinesByName, // <-- Calls the updated search function
              icon: _isMedicineLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2))
                  : const Icon(Icons.search),
              label: Text(
                  _isMedicineLoading ? 'Searching...' : 'Search Medicines'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.teal.shade700,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 10),
            if (_medicineError != null)
              Padding(
                padding: const EdgeInsets.only(top: 8.0),
                child: Text(_medicineError!,
                    style: const TextStyle(
                        color: Colors.red, fontStyle: FontStyle.italic)),
              ),
            // MODIFIED: Display flat list of MedicineDetailsResult
            if (_medicineResults.isNotEmpty)
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: _medicineResults
                    .map((m) => Padding(
                          padding: const EdgeInsets.only(top: 10.0),
                          child: Card(
                            color: Colors.teal.shade50,
                            margin: EdgeInsets.zero,
                            child: Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    m.name,
                                    style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.teal),
                                  ),
                                  const SizedBox(height: 4),
                                  Text('Manufacturer: ${m.manufacturer}',
                                      style: TextStyle(
                                          color: Colors.grey.shade700)),
                                  const SizedBox(height: 4),
                                  Text('Description: ${m.description}',
                                      style: const TextStyle(
                                          fontStyle: FontStyle.italic)),
                                ],
                              ),
                            ),
                          ),
                        ))
                    .toList(),
              ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Customer Dashboard'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              // In a real app, this would handle logout logic.
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                  content: Text('Logout functionality mocked.')));
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            _buildPharmacySearchSection(),
            _buildMedicineSearchSection(),
          ],
        ),
      ),
    );
  }
}
