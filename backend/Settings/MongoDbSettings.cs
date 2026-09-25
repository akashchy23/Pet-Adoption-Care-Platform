namespace PetHaven.Api.Settings;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = "PetHavenDb";
    public string UsersCollectionName { get; set; } = "Users";
    public string PetsCollectionName { get; set; } = "Pets";
    public string VetsCollectionName { get; set; } = "Veterinarians";
    public string AppointmentsCollectionName { get; set; } = "Appointments";
    public string AdoptionsCollectionName { get; set; } = "Adoptions";
    public string CommunityCollectionName { get; set; } = "CommunityPosts";
    public string LostFoundCollectionName { get; set; } = "LostFoundReports";
}
