# app.py
from flask import Flask, request, jsonify, send_file
import numpy as np
import pandas as pd
import math
import io
import matplotlib.pyplot as plt

app = Flask(__name__)

# Use your full simulation as a function
def run_simulation(params):
    # Constants from your script
    g0 = float(params['g0'])
    mass_flow_rate = float(params['mass_flow_rate'])
    initial_mass = float(params['initial_mass'])
    final_mass = float(params['final_mass'])
    dt = float(params['dt'])
    AREA = float(params['AREA'])
    base_thrust = float(params['base_thrust'])
    H = float(params['H'])
    rho0 = float(params['rho0'])
    L = float(params['L'])
    desired_alpha = float(params['desired_alpha'])
    r = float(params['r'])
    ry = float(params['ry'])
    rx = float(params['rx'])
    R = float(params['R'])
    M = float(params['M'])
    G = float(params['G'])
    pitch_start_time = float(params['pitch_start_time'])
    pitch_duration = float(params['pitch_duration'])
    final_pitch_angle = float(params['final_pitch_angle'])

    # Mass flow function
    def get_mass_flow(t):
        if 60 <= t < 100:
            return 30.0
        return mass_flow_rate

    # Initialize all arrays
    time = [0]; mass = [initial_mass]; velocity = [0]; acceleration = [0]
    altitude = [0]; vx = [0]; vy = [0]; vz = [0]; x = [0]; y = [0]; z = [0]
    theta = [0]; gimbal_angles = [0]; thrust_values = [0]; gravity_values = [0]
    i_values = [0]; q_values = [0]; ax_values = [0]; ay_values = [0]; az_values = [0]
    Fx_values = [0]; Fy_values = [0]; Fz_values = [0]; acc_magnitude_values = [0]
    FORCE_magnitude_values = [0]; v_total_List = [0]; tx_list = [0]; ty_list = [0]; tz_list = [0]

    while mass[-1] > final_mass:
        t = time[-1]; m = mass[-1]; h = altitude[-1]; v = velocity[-1]
        g = (G * M) / (R ** 2)
        I = (1/3) * m * L**2

        # Throttle logic
        if t < 60: throttle = 1.0
        elif 60 <= t < 70: throttle = 1.0 - 0.35 * ((t - 60)/10)
        elif 70 <= t < 80: throttle = 0.65
        elif 80 <= t < 90: throttle = 0.65 + 0.35*((t - 80)/10)
        else: throttle = 1.0

        thrust_nominal = base_thrust * throttle
        value = (desired_alpha * I) / (thrust_nominal * r)
        value = np.clip(value, -1.0, 1.0)
        gimbal_angle_rad = np.arcsin(value)
        current_thrust = thrust_nominal * np.cos(gimbal_angle_rad)
        thrust_values.append(current_thrust)

        # Pitch-over
        if t < pitch_start_time:
            current_theta = np.radians(90)
        elif pitch_start_time <= t < pitch_start_time + pitch_duration:
            frac = (t - pitch_start_time)/pitch_duration
            angle_deg = 90 - frac * (90 - final_pitch_angle)
            current_theta = np.radians(angle_deg)
        else:
            current_theta = np.radians(final_pitch_angle)
        theta.append(current_theta)

        # Atmospheric density
        rho = rho0 * np.exp(-h/H)

        # Drag
        v_total = np.sqrt(vx[-1]**2 + vy[-1]**2 + vz[-1]**2)
        if v_total < 340: cd = 0.295
        elif 340 <= v_total < 680: cd = 0.85
        else: cd = 1.3
        drag = 0.5 * rho * v_total**2 * cd * AREA
        drag_x = drag*(vx[-1]/v_total) if v_total != 0 else 0
        drag_y = drag*(vy[-1]/v_total) if v_total != 0 else 0
        drag_z = drag*(vz[-1]/v_total) if v_total != 0 else 0

        # Dynamic pressure
        q = 0.5*rho*v**2

        # Accelerations
        ax = (current_thrust*np.cos(current_theta) - drag_x)/m
        ay = (current_thrust*np.sin(current_theta) - drag_y)/m - g
        az = (current_thrust*np.sin(gimbal_angle_rad) - drag_z)/m - g
        acc = np.sqrt(ax**2 + ay**2 + az**2)

        Fx = m * ax; Fy = m * ay; Fz = m * az
        FORCE_MAGNITUDE = math.sqrt(Fx**2 + Fy**2 + Fz**2)
        ACC_MAGNITUDE = acc

        tx = ry*Fz - r*Fy
        ty = r*Fx - rx*Fz
        tz = rx*Fy - ry*Fx

        # Update velocities & positions
        new_vx = vx[-1] + ax*dt
        new_vy = vy[-1] + ay*dt
        new_vz = vz[-1] + az*dt
        new_velocity = np.sqrt(new_vx**2 + new_vy**2)

        new_x = x[-1] + new_vx*dt
        new_y = y[-1] + new_vy*dt
        new_z = z[-1] + new_vz*dt

        current_mfr = get_mass_flow(t)
        new_mass = m - current_mfr*dt
        new_time = t + dt
        new_altitude = new_y

        # Append
        time.append(new_time); mass.append(new_mass); velocity.append(new_velocity)
        acceleration.append(acc); ax_values.append(ax); ay_values.append(ay); az_values.append(az)
        acc_magnitude_values.append(ACC_MAGNITUDE); altitude.append(new_altitude)
        vx.append(new_vx); vy.append(new_vy); vz.append(new_vz)
        x.append(new_x); y.append(new_y); z.append(new_z)
        gravity_values.append(g); i_values.append(I); q_values.append(q)
        Fx_values.append(Fx); Fy_values.append(Fy); Fz_values.append(Fz)
        FORCE_magnitude_values.append(FORCE_MAGNITUDE)
        tx_list.append(tx); ty_list.append(ty); tz_list.append(tz)
        v_total_List.append(v_total)
        gimbal_angles.append(np.degrees(gimbal_angle_rad))

    df = pd.DataFrame({
        'Time (s)': time,
        'Mass (kg)': mass,
        'Velocity (m/s)': velocity,
        'Acceleration (m/s²)': acceleration,
        'ax (m/s²)': ax_values,
        'ay (m/s²)': ay_values,
        'az (m/s²)': az_values,
        'Altitude (m)': altitude,
        'vx (m/s)': vx,
        'vy (m/s)': vy,
        'vz (m/s)': vz,
        'Pitch angle (deg)': [np.degrees(a) for a in theta],
        'Gimbal angle (deg)': gimbal_angles,
        'Thrust (N)': thrust_values,
        'Gravity (m/s²)': gravity_values,
        'Moment of inertia': i_values,
        'Dynamic Pressure (Pa)': q_values,
        'Fx': Fx_values, 'Fy': Fy_values, 'Fz': Fz_values,
        'Force magnitude': FORCE_magnitude_values,
        'Acceleration magnitude': acc_magnitude_values,
        'Velocity vector magnitude': v_total_List
    })
    return df

@app.route('/simulate', methods=['POST'])
def simulate():
    params = request.json
    df = run_simulation(params)
    return df.to_json(orient='records')

@app.route('/download', methods=['POST'])
def download_csv():
    params = request.json
    df = run_simulation(params)
    buffer = io.StringIO()
    df.to_csv(buffer, index=False)
    buffer.seek(0)
    return send_file(io.BytesIO(buffer.getvalue().encode()),
                     mimetype='text/csv',
                     as_attachment=True,
                     download_name='Flight_mechanics.csv')

if __name__ == "__main__":
    app.run(debug=True)
