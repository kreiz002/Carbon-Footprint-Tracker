
import pandas as pd

#REFER TO SHEET1 FROM GHG CALCULATOR.XLSX=====================================================================
AC_electricity_percent=0.14
Average_elec_CO2_emissions=14019.99772
Average_FO_CO2_emissions=12,460
average_mpg=21.6
average_waste_emissions=692
boiler_replacement_cost_savings=78.34 #USD
boiler_replacement_savings_FO=1056
boiler_replacement_savings_NG=728
BTU_per_1000cf_NG=1023000
BTU_per_gallon_FO=138691.09 
BTU_per_gallon_propane=91335.94 
BTU_per_kWh=3412
CO2_C_ratio=3.67 
computer_energy_monitor_off=66.5
computer_energy_off=143
computer_energy_sleep_monitor_off=31.7
computer_energy_sleep_off=70.7
computer_sleep_savings=107.1
conventional_fridge_kWh=810
conversion_1000cf_to_therm=10.23
conversion_QBtu_to_Btu=1E+15
conversion_Tg_to_lb=2204622620
cost_per_kWh=0.1188
cost_per_mile=0.1964
dryer_energy=769
#e_factor	
#e_factor_value	
EF_fuel_oil_gallon=22.61
EF_fuel_oil_MMBtu=163.05
EF_natural_gas=119.58
EF_natural_gas_therm=11.68890913
EF_passenger_vehicle=19.6
EF_propane=12.43
ENERGYSTAR_fridge_kWh=488
fridge_replacement_kWh_savings=322
fuel_oil_cost=4.02 #USD
gas_cost_gallon=3.68 #USD
glass_recycling_avoided_emissions=-25.39
green_power_premium=0.02 #USD
heating_percent_electricity=0.09
heating_percent_fuel_oil=0.87
heating_percent_NG=0.63
heating_percent_propane=0.70
HH_size=2.57
HHV_fuel_oil=138691.09 
HHV_natural_gas=1023000
HHV_propane=91335.94 
kWh_per_load_laundry=0.96
lamp_cost_savings=4.00 #USD
lamp_kWh_savings=33
mag_recycling_avoided_emissions=-27.46
metal_recycling_avoided_emissions=-89.38
monthly_elec_consumption=943
monthly_FO_consumption=46
monthly_NG_Consumption=5500
monthly_propane_consumption=39
Natural_gas_cost_1000CF=10.68 #USD
Natural_gas_cost_therm=1.04 #USD
newspaper_recycling_avoided_emissions=-113.14
NG_CO2_annual_emissions=7892
nonCO2_vehicle_emissions_ratio=1.01
OilFuelRate=0
plastic_recycling_avoided_emissions=-35.56
propane_cost=2.47 #USD
thermostat_cooling_savings=0.06
thermostat_heating_savings=0.03
vehicle_efficiency_improvements=0.04
window_replacement_cost_savings=150 #USD
window_replacement_energy_savings=25210000


class Producer:
    def __init__(self, habitants, zip, heat_src):
        self.habitants = habitants
        self.zip = zip
        self.heat_src = heat_src  #Enter 1 for natural gas, 2 for electric heat, 3 for oil, 4 for propane, 5 for wood, or 6 if you do not heat your house
        
        
class Vehicle(Producer):
    def __init__(self, miles_per_week, avg_fuel_efficiency, maintenance):
        super().__init__(self)
        self.miles_per_week = miles_per_week
        self.avg_fuel_efficiency = avg_fuel_efficiency
        self.maintenance = maintenance

    def emmissions(self):
        miles_per_year = self.miles_per_week*52
        emmissions = miles_per_year * (1/self.avg_fuel_efficiency) * EF_passenger_vehicle * nonCO2_vehicle_emissions_ratio #19.6, 1.01
        efficiency = emmissions * vehicle_efficiency_improvements
        emmissions += efficiency
        return round(emmissions)

    def emmissions_maintenance(self):
        miles_per_year = self.miles_per_week*52
        emmissions = (miles_per_year/self.avg_fuel_efficiency) * EF_passenger_vehicle * nonCO2_vehicle_emissions_ratio #19.6, 1.01

        return round(emmissions)
    
class HomeEnergy(Producer):
    def __init__(self):
        super().__init__(self)

    def egrid_lookup(zip):
        egrid = pd.read_excel('EGRID_DATA.xlsx')
        #egrid[egrid['Zip'] == zip]
        lookup = egrid.iloc[zip, 'Subregion annual CO2e output emission rate (lb/MWh)']
        return lookup
    
    def natural_gas_consumption(self, option, input):
        if option==1:
            emissions = (input/Natural_gas_cost_1000CF) * EF_natural_gas * 12
        elif option==2:
            emissions = EF_natural_gas * input * 12
        elif option==3:
            emissions = EF_natural_gas_therm * input * 12
        else:
            emissions = "Only allowed number 1, 2, or 3."
        
        return emissions
    
    def electricity_consumption(self, option, input):
        if option==1:
            emissions = (input/cost_per_kWh) * e_factor_value



#class Home(Source):
    #def __



v1 = Vehicle(75, 21.6, 1)

h1 = HomeEnergy(zip=33178)

print(v1.emmissions())
print(v1.emmissions_maintenance())

print(h1.egrid_lookup)