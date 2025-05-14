
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Zopio Mobile</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Icon name="person" size={24} color="#f35815" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to Zopio</Text>
          <Text style={styles.welcomeSubtitle}>Your mobile experience begins here</Text>
        </View>
        
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <View style={styles.featureCard}>
            <Icon name="speed" size={32} color="#f35815" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Native Performance</Text>
              <Text style={styles.featureDescription}>Experience the speed and responsiveness of a native app</Text>
            </View>
          </View>
          
          <View style={styles.featureCard}>
            <Icon name="offline-bolt" size={32} color="#f35815" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Offline Support</Text>
              <Text style={styles.featureDescription}>Use the app even when you're not connected to the internet</Text>
            </View>
          </View>
          
          <View style={styles.featureCard}>
            <Icon name="notifications" size={32} color="#f35815" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Push Notifications</Text>
              <Text style={styles.featureDescription}>Stay updated with real-time notifications</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerTab}>
          <Icon name="home" size={24} color="#f35815" />
          <Text style={styles.footerTabText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerTab}>
          <Icon name="search" size={24} color="#666" />
          <Text style={styles.footerTabTextInactive}>Search</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerTab}>
          <Icon name="settings" size={24} color="#666" />
          <Text style={styles.footerTabTextInactive}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  featuresSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureContent: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 8,
  },
  footerTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerTabText: {
    fontSize: 12,
    color: '#f35815',
    marginTop: 4,
  },
  footerTabTextInactive: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default HomeScreen;
